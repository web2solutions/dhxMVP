var validator = require("validator");
var config = require("../config");
var email = require("../email");
var crypto = require("crypto");
var request = require('request');
var winston = require('winston');
var winston = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)(),
        new(winston.transports.File)({
            filename: config.log_file,
            handleExceptions: true,
            humanReadableUnhandledException: true
        })
    ]
});
var user = {};
user.codes = {
    update: {
        0: "success",
        1: "failure"
    },

    register: {
        100: "User exists.",
        101: "Invalid username.",
        102: "Invalid password (too short).",
        400: "Internal error.",
        401: "Could not get user token.",
        500: "Could not create default organization for the user",
        501: "Error requesting the /org/create end point",
        502: "Could not set the default_org for the user"
    },
    activate: {
        0: "success",
        1: "User not found",
        2: "Invalid activation code. Please re-enter and try again.",
        3: "Could not save user data"
    },

    login: {
        2: "failure",
        3: "This username is not recognized. <br> For an existing account, please Reset Password. <br> For a new account, please Create Account.",
        4: "Invalid password"
    },
    info: {
        1: "failure"
    },
    passwordreset: {
        0: "success",
        1: "failure",
        2: "2FA code required",
        3: "This user account doesn’t exist; please use Create Account to setup a new account.",
        4: 'Could not send e-mail message'
    }
};
user.checkpassword = function(password) {
    if (typeof password !== "string" || !validator.isLength(password, 8)) {
        return false;
    }
    return true;
};
user.checkusername = function(username) {
    if (typeof username !== "string" ) {
        return false;
    }
    return true; // validator.isEmail(username || "");
};
user.checkauth = function(password, dbpassword) {
    var type = dbpassword.substr(0, dbpassword.indexOf(":"));
    dbpassword = dbpassword.substr(type.length + 1);
    if (type == "local") {
        var salt = dbpassword.substr(0, 96);
        dbpassword = dbpassword.substr(96);
        return crypto.createHash("sha256").update("550ca68338a071d3b38647eb" + salt + password).digest("hex") == dbpassword;
    }
    return false;
};
user.saltpassword = function(password) {
    var salt = crypto.randomBytes(48).toString("hex");
    var epass = "local:" + salt + crypto.createHash("sha256").update("550ca68338a071d3b38647eb" + salt + password).digest("hex");
    return epass;
};
user.checkuserexists = function(username, password, cb) {

    if( ! user.checkusername(username) )
    {
        cb(true);
        return;
    }

    username = username.toLowerCase();
    var criteria = {
        username: username
    };
    //password is optional
    if (typeof password === 'function') {
        cb = password;
        password = undefined;
    }
    user.checkpassword(password) && (criteria.password = password);
    user.app.models.user.find(criteria, function(e, d) {
        if (e || d.length) {
            cb(true);
            return;
        }
        cb(false);
    });
};

user.login = function(username, password, twofactor, cb) {
    username = username.toLowerCase();
    user.app.models.user.find({
        username: username
    }, function(e, d) {
        var valid;
        if (e || d.length !== 1) {
            winston.error(e);
            cb(3);
            return;
        }
        valid = user.checkauth(password, d[0].password);
        if (valid && d[0].twofa === "none") {
            cb(0);
            return;
        }
        if (valid) {
            if (twofactor == undefined) {
                cb(1);
                return;
            }
            user.checkcode(username, twofactor, function(valid) {
                if (valid) {
                    cb(0);
                    return;
                }
                cb(2);
            });
            return;
        }
        // invalid password
        return cb(4);
    });
};
user.update = function(token, data, cb) {
    user.getinfo(token, function(s, u) {
        if (!s) {
            return cb(1);
        }
        for (var i in data) {
            if (i != "_id") {
                u.meta[i] = data[i];
            }
        }
        u.save(function(e) {
            if (e) {
                return cb(1);
            }
            cb(0);
        });
    });
};
user.set_default_organization = function(token, org_id, cb) {
    console.log(token, org_id);
    user.getinfo(token, function(s, u) {
        if (!s) {
            return cb(1);
        }
        u.meta.default_org = org_id;
        u.save(function(e) {
            if (e) {
                console.log(e);
                return cb(2);
            }
            cb(0, u);
        });
    });
};
user.register = function(req, cb) {
    var code = 0,
        user_model,
        fields = [
            'username',
            'password',
            'joindate',
            'active',
            'activation',
            'force_change_password',
            'type',
            'display_name',
            'first_name',
            'last_name',
            'phone',
            'picture',
            'city',
            'state',
            'country'
        ],
        input = {};

    // validate user input - prevent injection
    fields.forEach( function( field ){
        //if( typeof req.body[ field ] === 'string' || typeof req.body[ field ] === 'number' )
        //{
            input[ field ] = req.body[ field ];
        //}
    } );

    if( ! user.checkusername(input.username) ) code = 101;    
    if( !user.checkpassword(input.password) ) code = 102;

    input.username = input.username.toLowerCase();
     
    
    if (code == 0) {
        user.checkuserexists(input.username, function(exists) {
            if (!exists) {
                var _data = null;
                u_data = {
                    username: input.username,
                    password: user.saltpassword(input.password),
                    type: input.type,
                    active: true
                };
                user_model = new user.app.models.user(u_data);
                user_model.save(function(e) {
                    if (e) {
                        cb(400);
                    }
                    cb(0);
                    user.send_create_account_message(user_model, username, meta);
                });
            } else {
                cb(100);
            }
        });
        return;
    }
    cb(code);
};
user.send_create_account_message = function(user_model, username, meta) {
    var token = crypto.createHash("sha256").update(user_model.joindate.toString()).digest("hex"),
        data = {
            to: username,
            from: config.email.from,
            template: "welcome",
            subject: "Registration and Account Activation",
            data: {
                activation: token,
                username: meta.display_name ? meta.display_name : username,
                email: username,
                url: config.url
            }
        };
    email.send(data, function(e, i) {
        if (e) {
            code = 2;
            //user_model.remove();
        }
        //cb(code);
    });
};
user.getcode = function(username, cb) {
    username = username.toLowerCase();
    user.app.models.user.find({
        username: username
    }, function(e, d) {
        if (e) {
            cb(e);
            return;
        }
        if (d.length == 0 || d.length > 1) {
            cb();
            return;
        }
        var tok = Math.floor(Math.random() * (99999 - 10000) + 10000);
        d[0].codes.push({
            token: tok
        });
        d[0].save(function(e) {
            if (e) {
                cb(e);
                return;
            }
            cb(undefined, tok);
        });
    });
    user.app.models.user.remove({
        "codes.time": {
            $gt: new Date() - 1000 * 60 * 5
        }
    }, function(e, d) {
        e && winston.error("Removing old codes", e);
    });
};
user.checkcode = function(username, code, cb) {
    username = username.toLowerCase();
    user.app.models.user.find({
        username: username,
        "codes.token": code
    }, function(e, d) {
        if (e || d.length == 0 || d.length > 1) {
            cb(false);
            return;
        }
        for (var i = 0; i < d[0].codes.length; i++) {
            if (d[0].codes[i].token == code) {
                var timebetween = Math.round(Math.abs(d[0].codes[i].date - new Date()) / 1000 / 60);
                if (timebetween > config["2FA Expiration"]) {
                    cb(false);
                    return;
                }
            }
        }
        d[0].update({
            username: username,
            $pull: {
                "codes": {
                    "token": code
                }
            }
        }, function(e) {
            if (e) {
                cb(false);
                return;
            }
            cb(true);
        });
    });
};
user.gettoken = function(username, cb) {
    username = username.toLowerCase();
    user.app.models.user.find({
        username: username
    }, function(e, d) {
        if (e) {
            cb(e);
            return;
        }
        if (d.length == 0 || d.length > 1) {
            cb();
            return;
        }
        var tok = crypto.createHash("sha256").update(Date.now() + crypto.randomBytes(64).toString("hex")).digest("hex");
        winston.info('token for ' + username + ' : ', tok);
        //d[0].tokens = [];
        d[0].tokens.push({
            token: tok
        });
        d[0].save(function(e) {
            if (e) {
                cb(e);
                return;
            }
            cb(undefined, tok);
        });
    });
};
user.checktoken = function(token, cb) {
    user.app.models.user.find({
        "tokens.token": token
    }).populate("meta.organizations").exec(function(e, d) {
        if (e || d.length !== 1) {
            return cb(false);
        }
        var cbv, pull = [];
        for (var i = 0; i < d[0].tokens.length; i++) {
            var timebetween = Math.round(Math.abs(d[0].tokens[i].date - new Date()) / 1000 / 60);
            //if(timebetween > config["token expiration"]){
            //  d[0].tokens.pull({ _id: d[0].tokens[i]._id });
            //  continue;
            //}
            if (d[0].tokens[i].token == token) {
                var n = new Date().getTime(),
                    nn = new Date(d[0].tokens[i].date).getTime();
                if (timebetween <= config["token expiration"]) {
                    d[0].tokens[i].date = new Date();
                    cbv = d[0];
                }
            }
        }
        d[0].save(function() {
            cb(cbv ? true : false, cbv);
        });
        return;
    });
};
user.getinfo = function(token, cb) {
    user.app.models.user.find({
        "tokens.token": token
    }).exec(function(e, d) {
        if (e || d.length != 1) {
            cb(false);
            return;
        }
        cb(true, d[0]);
    });
};

user.activate = function(username, token, cb) {
    username = username.toLowerCase();
    user.app.models.user.find({
        username: username
    }, function(e, d) {
        if (e || d.length == 0 || d.length > 1) {
            cb(1);
            return;
        }
        var t = crypto.createHash("sha256").update(d[0].joindate.toString()).digest("hex");
        if (t != token) {
            cb(2);
            return;
        }
        d[0].active = true;
        d[0].save(function(e) {
            if (e) {
                cb(3);
                return;
            }
            cb(0);
        });
    });
};
user.passwordreset = function(username, twofactor, cb) {
    username = username.toLowerCase();
    user.app.models.user.find({
        username: username
    }, function(e, d) {
        if (e || d.length !== 1) {
            cb(3);
            return;
        }
        var pw = crypto.randomBytes(8).toString("hex");
            d[0].password = user.saltpassword(pw);
            d[0].save(function(e) {
                if (e) {
                    return cb(1);
                }
                var data = {
                    to: d[0].username,
                    from: config.email.from,
                    template: "passwordreset",
                    subject: "Password Reset",
                    data: {
                        password: pw
                    }
                };
                email.send(data, function(e, i) {
                    cb(e ? 4 : 0);
                });
            });
    });
};
user.passwordchange = function(token, oldpass, newpass, cb) {
    if (!user.checkpassword(newpass)) {
        return cb(1);
    }
    user.checktoken(token, function(s, u) {
        if (!s) {
            return cb(1);
        }
        if (!user.checkauth(oldpass, u.password)) {
            return cb(1);
        }
        var pass = user.saltpassword(newpass);
        u.password = pass;
        u.save(function(e) {
            return cb(e ? 1 : 0);
        });
    });
};
user._vuser = function(token, cb) {
    user.checktoken(token, function(e, users) {
        if (!e || !users) {
            cb(2);
            return;
        }
        if (!users.active) {
            cb(1);
            return;
        }
        cb(0, users);
    });
};
var bind = function(app) {
    if (app && app.post) {
        app.post("/user/password/reset", function(req, res) {
            user.passwordreset(req.body.username, req.body.twofa || "", function(code) {
                res.send(JSON.stringify({
                    code: code,
                    response: user.codes.passwordreset[code]
                }));
            });
        });
        app.post("/user/password/change", function(req, res) {
            user.passwordchange(req.body.token, req.body.oldpass, req.body.newpass, function(code) {
                res.send(JSON.stringify({
                    code: code,
                    response: user.codes.passwordreset[code]
                }));
            });
        });
        app.post("/user/login", function(req, res) {
            user.login(req.body.username, req.body.password, req.body.code || undefined, function(code) {
                user.gettoken(req.body.username, function(e, t) {
                    if (e || !t) {
                        res.send(JSON.stringify({
                            code: 2,
                            response: user.codes.login[2]
                        }));
                        return;
                    }
                    user.app.models.user.find({
                        username: req.body.username
                    }, function(error, data) {
                        res.send(JSON.stringify({
                            code: 0,
                            response: {
                                token: t,
                                meta: data[0].meta,
                                user_id: data[0]._id,
                                type: data[0].type,
                            }
                        }));
                    });
                });
            });
        });
        app.post("/user/info", function(req, res) {
            user.getinfo(req.body.token, function(valid, t) {
                if (!valid || !t) {
                    res.send(JSON.stringify({
                        code: 1,
                        response: user.codes.info[1]
                    }));
                    return;
                }
                var j = JSON.parse(JSON.stringify(t.meta.toJSON()));
                j.email = t.username;
                j.invites = t.invites;
                res.send(JSON.stringify({
                    code: 0,
                    response: j
                }));
                return;
            });
        });
        
        app.post("/user/register", function(req, res) {
             // username, password, meta, type,
            var code = user.register(req.body, function(code) {
                user.gettoken(req.body.username, function(e, t) {
                    if (e || !t) {
                        res.send(JSON.stringify({
                            code: 400,
                            response: user.codes.register[400]
                        }));
                        return;
                    }
                    res.send(JSON.stringify({
                        code: 0,
                        response: t
                    }));
                });
            });
        });
        app.post("/user/activate", function(req, res) {
            user.activate(req.body.username, req.body.token, function(code) {
                res.send(JSON.stringify({
                    code: code,
                    response: user.codes.activate[code]
                }));
            });
        });
        app.post("/user/update", function(req, res) {
            user.update(req.body.token, req.body.data, function(code) {
                res.send(JSON.stringify({
                    code: code,
                    response: user.codes.update[code]
                }));
            });
        });
        
        user.app = app;
    }
    return user;
};
module.exports = bind;
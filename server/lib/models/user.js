var user = {
    username: String,
    password: String,
    joindate: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: false
    },
    activation: {
        type: String
    },
    force_change_password: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'staff'
    }, // staff, admin
    display_name: String,
    first_name: String,
    last_name: String,
    phone: String,
    picture: String,
    address: String,
    city: String,
    state: String,
    country: {
        type: String,
        default: 'USA'
    }
    codes: [{
        date: {
            type: Date,
            default: Date.now
        },
        token: String
    }],
    tokens: [{
        date: {
            type: Date,
            default: Date.now
        },
        token: String
    }]
};
module.exports = {
    user: function(mongoose) {
        return mongoose.model("users", user);
    }
};
/*
db.users.find().snapshot().forEach(
    function (elem) {
        if( elem.meta.default_org && elem.meta.default_org.length > 3)
        {
  
        }
        else
        {
          db.users.update(
            {
                _id: elem._id
            },
            {
                $set: {
                    "meta.default_org": elem.meta.organizations[0]
                }
            }
          );
        }
    }
);
*/
/*
db.users.find().snapshot().forEach(
    function (elem) {

      if( elem.type == 'Client')
      {
        db.users.update(
                {
                    _id: elem._id
                },
                {
                  $set: {
                      "IS_Xpert": false,
                      "IS_Client": true,
                      "MC_ADMIN": false,
                      "IS_PM": false,
                  }
                }
            );
      }
      else if( elem.type == 'Xpert')
      {
        db.users.update(
                {
                    _id: elem._id
                },
                {
                  $set: {
                      "IS_Xpert": true,
                      "IS_Client": false,
                      "MC_ADMIN": false,
                      "IS_PM": false,
                  }
                }
            );
      }
    }
);
*/
var user = {
        __v: $dhx.ui.mvp.model.helpers.schema.defaults.__v,
        _id: $dhx.ui.mvp.model.helpers.schema.defaults._id,
        
        first_name: {
            type: 'string',
            default: null,
            unique: false,
            validate: {
                required: true,
                mask_to_use: undefined,
                rules: 'NotEmpty'
            },
            ui: {
                info: false,
                note: '',
                maxLength: '',
                form: {
                    label: 'First name',
                    type: 'input',
                },
                grid: {
                    header: 'First name',
                    align: 'left',
                    coltype: 'ro',
                    width: '120'
                }
            }
        },
        last_name: {
            type: 'string',
            default: null,
            unique: false,
            validate: {
                required: true,
                mask_to_use: undefined,
                rules: ''
            },
            ui: {
                info: false,
                note: '',
                maxLength: '',
                form: {
                    label: 'Last name',
                    type: 'input',
                },
                grid: {
                    header: 'Last name',
                    align: 'left',
                    coltype: 'ro',
                    width: '120'
                }
            }
        },
        display_name: {
            type: 'string',
            default: null,
            unique: false,
            validate: {
                required: true,
                mask_to_use: undefined,
                rules: ''
            },
            ui: {
                info: false,
                note: '',
                maxLength: '',
                form: {
                    label: 'Display name',
                    type: 'input',
                },
                grid: {
                    header: 'Display name',
                    align: 'left',
                    coltype: 'ro',
                    width: '0'
                }
            }
        },
        picture: {
            type: 'string',
            default: null,
            unique: false,
            validate: {
                required: false,
                mask_to_use: undefined,
                rules: ''
            },
            ui: {
                info: false,
                note: '',
                maxLength: '',
                form: {
                    label: 'Picture',
                    type: 'container',
                },
                grid: {
                    header: 'Picture',
                    align: 'left',
                    coltype: 'ro',
                    width: '0'
                }
            }
        },
        phone: {
            type: 'string',
            default: null,
            unique: false,
            validate: {
                required: false,
                mask_to_use: 'us_phone',
                rules: ''
            },
            ui: {
                info: false,
                note: '',
                maxLength: '',
                form: {
                    label: 'Phone',
                    type: 'input',
                },
                grid: {
                    header: 'Phone',
                    align: 'right',
                    coltype: 'ro',
                    width: '0'
                }
            }
        },
        address: {
            type: 'string',
            default: null,
            unique: false,
            validate: {
                required: true,
                mask_to_use: undefined,
                rules: ''
            },
            ui: {
                info: false,
                note: '',
                maxLength: '',
                form: {
                    label: 'Address',
                    type: 'input',
                },
                grid: {
                    header: 'Address',
                    align: 'left',
                    coltype: 'ro',
                    width: '0'
                }
            }
        },
        city: {
            type: 'string',
            default: null,
            unique: false,
            validate: {
                required: true,
                mask_to_use: undefined,
                rules: ''
            },
            ui: {
                info: false,
                note: '',
                maxLength: '',
                form: {
                    label: 'City',
                    type: 'input',
                },
                grid: {
                    header: 'City',
                    align: 'left',
                    coltype: 'ro',
                    width: '0'
                }
            }
        },
        state: {
            type: 'string',
            default: null,
            unique: false,
            validate: {
                required: true,
                mask_to_use: undefined,
                rules: ''
            },
            ui: {
                info: false,
                note: '',
                maxLength: '',
                form: {
                    label: 'State',
                    type: 'input',
                },
                grid: {
                    header: 'State',
                    align: 'left',
                    coltype: 'ro',
                    width: '0'
                }
            }
        },
        country: {
            type: 'string',
            default: 'USA',
            unique: false,
            validate: {
                required: true,
                mask_to_use: undefined,
                rules: ''
            },
            ui: {
                info: false,
                note: '',
                maxLength: '',
                form: {
                    label: 'Country',
                    type: 'input',
                },
                grid: {
                    header: 'Country',
                    align: 'left',
                    coltype: 'ro',
                    width: '0'
                }
            }
        },
        
        username: {
            type: 'string',
            default: null,
            unique: false,
            validate: {
                required: true,
                mask_to_use: undefined,
                rules: 'NotEmpty'
            },
            ui: {
                info: false,
                note: '',
                maxLength: '',
                form: {
                    label: 'Username',
                    type: 'input',
                },
                grid: {
                    header: 'Username',
                    align: 'left',
                    coltype: 'ro',
                    width: '120'
                }
            }
        },
        password: {
            type: 'string',
            default: null,
            unique: false,
            validate: {
                required: true,
                mask_to_use: undefined,
                rules: 'NotEmpty'
            },
            ui: {
                info: false,
                note: '',
                maxLength: '',
                form: {
                    label: 'Password',
                    type: 'input',
                },
                grid: {
                    header: 'Password',
                    align: 'left',
                    coltype: 'ro',
                    width: '120'
                }
            }
        },
        joindate: { 
            type: 'number',
            default: null,
            unique: false,
            validate: {
                required: true,
                mask_to_use: undefined,
                rules: 'NotEmpty',
            },
            ui: {
                info: false,
                note: '',
                maxLength: '',
                form: {
                    label: 'Join date',
                    type: 'calendar',

                },
                grid: {
                    header: 'Join date',
                    align: 'left',
                    coltype: 'moment_from',
                    width: '90'
                }
            }
        },
        force_change_password: {
            type: 'boolean',
            default: true,
            unique: false,
            validate: {
                required: true,
                mask_to_use: undefined,
                rules: '',
            },
            ui: {
                info: false,
                note: '',
                maxLength: '',
                form: {
                    label: 'Force change password',
                    type: 'btn2state',

                },
                grid: {
                    header: 'Force change password',
                    align: 'left',
                    coltype: 'acheck',
                    width: '90'
                }
            }
        },
        active: {
            type: 'boolean',
            default: true,
            unique: false,
            validate: {
                required: true,
                mask_to_use: undefined,
                rules: '',
            },
            ui: {
                info: false,
                note: '',
                maxLength: '',
                form: {
                    label: 'Active',
                    type: 'btn2state',

                },
                grid: {
                    header: 'Active',
                    align: 'left',
                    coltype: 'acheck',
                    width: '90'
                }
            }
        },
    };



if (typeof define === 'function' && define.amd) { //AMD
    define(function() {
        return user;
    });
} else if (typeof module !== 'undefined' && module.exports) { //node
    module.exports = user;
}
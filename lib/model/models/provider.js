var provider = {
        __v: $dhx.ui.mvp.model.helpers.schema.defaults.__v,
        _id: $dhx.ui.mvp.model.helpers.schema.defaults._id,
        name: {
            type: 'string',
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
                    label: 'Company name',
                    type: 'input',

                },
                grid: {
                    header: 'Company name',
                    align: 'left',
                    coltype: 'ro',
                    width: '*'
                }
            }
        },
        account_holder_name: {
            type: 'string',
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
                    label: 'Account holder name',
                    type: 'input',

                },
                grid: {
                    header: 'Account holder name',
                    align: 'left',
                    coltype: 'ro',
                    width: '120'
                }
            }
        },
        login: {
            type: 'string',
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
                    label: 'Login',
                    type: 'input',

                },
                grid: {
                    header: 'Login',
                    align: 'left',
                    coltype: 'ro',
                    width: '0'
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
                rules: 'NotEmpty',
            },
            ui: {
                info: false,
                note: '',
                maxLength: 18,
                form: {
                    label: 'Password',
                    type: 'password',

                },
                grid: {
                    header: 'Password',
                    align: 'left',
                    coltype: 'ro',
                    width: '0'
                }
            }
        },
        email: {
            type: 'string',
            default: null,
            unique: false,
            validate: {
                required: true,
                mask_to_use: 'email',
                rules: 'NotEmpty,ValidEmail',
            },
            ui: {
                info: false,
                note: '',
                maxLength: '',
                form: {
                    label: 'E-mail',
                    type: 'input',

                },
                grid: {
                    header: 'E-mail',
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
                required: true,
                mask_to_use: 'universal_phone',
                rules: 'NotEmpty',
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
                    align: 'left',
                    coltype: 'ro',
                    width: '0'
                }
            }
        },
        country: {
            type: 'string',
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
                    label: 'Country',
                    type: 'combo',

                },
                grid: {
                    header: 'Country',
                    align: 'left',
                    coltype: 'coro',
                    width: '0'
                }
            }
        },
        status: { //  [ Active , Backup , Inactive , Terminated , Archived ]
            type: 'string',
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
                    label: 'Provider status',
                    type: 'combo',
                    options: [
                        { value: 'Active', text: 'Active'},
                        { value: 'Backup', text: 'Backup'},
                        { value: 'Inactive', text: 'Inactive'},
                        { value: 'Terminated', text: 'Terminated'},
                        { value: 'Archived', text: 'Archived'}
                    ]
                },
                grid: {
                    header: 'Provider status',
                    align: 'center',
                    coltype: 'ro',
                    width: '120'
                }
            }
        },
        expiration: { 
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
                    label: 'Expiration',
                    type: 'calendar',

                },
                grid: {
                    header: 'Expiration',
                    align: 'left',
                    coltype: 'moment_to',
                    width: '120'
                }
            }
        }
    };



if (typeof define === 'function' && define.amd) { //AMD
    define(function() {
        return provider;
    });
} else if (typeof module !== 'undefined' && module.exports) { //node
    module.exports = provider;
}
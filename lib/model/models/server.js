
var server = {
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
                    label: 'Server name',
                    type: 'input',

                },
                grid: {
                    header: 'Server name',
                    align: 'left',
                    coltype: 'ro',
                    width: '*'
                }
            }
        },
        provider: {
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
                    label: 'Provider name',
                    type: 'combo',

                },
                grid: {
                    header: 'Provider name',
                    align: 'left',
                    coltype: 'coro',
                    width: '0'
                }
            }
        },
        type: {
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
                    label: 'Type',
                    type: 'combo',
                    options:[
                        {value: 'Dedicated', text:'Dedicated'},
                        { value:'Cloud', text: 'Cloud'},
                        { value: 'VPS', text : 'VPS'}
                    ]
                },
                grid: {
                    header: 'Type',
                    align: 'left',
                    coltype: 'coro',
                    width: '120'
                }
            }
        },
        price: {
            type: 'number',
            default: null,
            unique: false,
            validate: {
                required: true,
                mask_to_use: 'currency',
                rules: ''
            },
            ui: {
                info: false,
                note: '',
                maxLength: '',
                form: {
                    label: 'Price',
                    type: 'input',
                },
                grid: {
                    header: 'Price',
                    align: 'left',
                    coltype: 'UScurrency',
                    width: '90'
                }
            }
        },
        purchase: { 
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
                    label: 'Date of purchase',
                    type: 'calendar',

                },
                grid: {
                    header: 'Date of purchase',
                    align: 'left',
                    coltype: 'moment_from',
                    width: '90'
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
                    width: '90'
                }
            }
        },
        status: { //  [ free, used ]
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
                    label: 'Server status',
                    type: 'combo',
                    options: [
                        { value: 'Active', text: 'Active'},
                        { value: 'Inactive', text: 'Inactive'},
                        { value: 'Backup', text: 'Backup'},
                        { value: 'Suspended', text: 'Suspended'}
                    ]
                },
                grid: {
                    header: 'Server status',
                    align: 'left',
                    coltype: 'ro',
                    width: '120'
                }
            }
        },
        notes: {
            type: 'string',
            default: null,
            unique: false,
            validate: {
                required: false,
                mask_to_use: undefined,
                rules: '',
            },
            ui: {
                info: false,
                note: '',
                maxLength: '',
                form: {
                    label: 'Notes',
                    type: 'input',

                },
                grid: {
                    header: 'Notes',
                    align: 'left',
                    coltype: 'ro',
                    width: '0'
                }
            }
        }
    };



if (typeof define === 'function' && define.amd) { //AMD
    define(function() {
        return server;
    });
} else if (typeof module !== 'undefined' && module.exports) { //node
    module.exports = server;
}
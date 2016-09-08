var customer = {
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
                    label: 'Name',
                    type: 'input',

                },
                grid: {
                    header: 'Name',
                    align: 'left',
                    coltype: 'ro',
                    width: '*'
                }
            }
        },
        mobile: {
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
                    label: 'Mobile',
                    type: 'input',

                },
                grid: {
                    header: 'Mobile',
                    align: 'left',
                    coltype: 'ro',
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
                    label: 'Customer type',
                    type: 'combo',

                },
                grid: {
                    header: 'Customer type',
                    align: 'left',
                    coltype: 'ro',
                    width: '120'
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
                    label: 'Provider',
                    type: 'combo',

                },
                grid: {
                    header: 'Provider',
                    align: 'left',
                    coltype: 'ro',
                    width: '120'
                }
            }
        },
        assigned_ips: {
            type: 'array',
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
                    label: 'Assigned IPs',
                    type: 'container',

                },
                grid: {
                    header: 'Assigned IPs',
                    align: 'left',
                    coltype: 'ro',
                    width: '0'
                }
            }
        },
        expiration: { 
            type: 'date',
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
                    coltype: 'ro',
                    width: '90'
                }
            }
        },
        status: {
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
                    label: 'Customer status',
                    type: 'combo',
                    options:[
                        {value: 'Active', text:'Active'},
                        { value:'Issue', text: 'Issue'},
                        { value: 'Stopped', text : 'Stopped'}
                    ]
                },
                grid: {
                    header: 'Customer status',
                    align: 'left',
                    coltype: 'ro',
                    width: '90'
                }
            }
        },
        maintenance: {
            type: 'boolean',
            default: false,
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
                    label: 'Maintenance',
                    type: 'checkbox',

                },
                grid: {
                    header: 'Maintenance',
                    align: 'left',
                    coltype: 'ro',
                    width: '90'
                }
            }
        },
        notes: {
            type: [],
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
                    type: 'container',

                },
                grid: {
                    header: 'Notes',
                    align: 'left',
                    coltype: 'ro',
                    width: '0'
                }
            }
        },
    };



if (typeof define === 'function' && define.amd) { //AMD
    define(function() {
        return customer;
    });
} else if (typeof module !== 'undefined' && module.exports) { //node
    module.exports = customer;
}
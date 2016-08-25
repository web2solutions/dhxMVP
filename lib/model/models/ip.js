var ip = {
        __v: $dhx.ui.mvp.model.helpers.schema.defaults.__v,
        _id: $dhx.ui.mvp.model.helpers.schema.defaults._id,
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
                    type: 'input',

                },
                grid: {
                    header: 'Provider name',
                    align: 'left',
                    coltype: 'ro',
                    width: '*'
                }
            }
        },
        number: {
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
                    label: 'IP number',
                    type: 'input',

                },
                grid: {
                    header: 'IP number',
                    align: 'left',
                    coltype: 'ro',
                    width: '120'
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
                    label: 'IP status',
                    type: 'combo',
                    options: [
                        { value: 'Available', text: 'Available'},
                        { value: 'Used', text: 'Used'}
                    ]
                },
                grid: {
                    header: 'IP status',
                    align: 'left',
                    coltype: 'ro',
                    width: '120'
                }
            }
        }
    };



if (typeof define === 'function' && define.amd) { //AMD
    define(function() {
        return ip;
    });
} else if (typeof module !== 'undefined' && module.exports) { //node
    module.exports = ip;
}
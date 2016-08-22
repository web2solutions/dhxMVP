var pet = {
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
                    width: '120'
                }
            }
        },
        age: {
            type: 'number',
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
                    label: 'Age',
                    type: 'input',
                },
                grid: {
                    header: 'Age',
                    align: 'left',
                    coltype: 'ro',
                    width: '120'
                }
            }
        }
    };



if (typeof define === 'function' && define.amd) { //AMD
    define(function() {
        return user;
    });
} else if (typeof module !== 'undefined' && module.exports) { //node
    module.exports = user;
}
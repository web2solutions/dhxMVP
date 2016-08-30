var customer_type = {
        __v: $dhx.ui.mvp.model.helpers.schema.defaults.__v,
        _id: $dhx.ui.mvp.model.helpers.schema.defaults._id,
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
                    type: 'input',

                },
                grid: {
                    header: 'Customer type',
                    align: 'left',
                    coltype: 'ro',
                    width: '*'
                }
            }
        }
    };



if (typeof define === 'function' && define.amd) { //AMD
    define(function() {
        return customer_type;
    });
} else if (typeof module !== 'undefined' && module.exports) { //node
    module.exports = customer_type;
}
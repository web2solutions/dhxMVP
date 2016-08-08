var question = {
        __v: $dhx.ui.mvp.model.helpers.schema.defaults.__v,
        _id: $dhx.ui.mvp.model.helpers.schema.defaults._id,
        question: {
            type: 'string',
            default: '',
            unique: false,
            validate: {
                required: true,
                mask_to_use: undefined,
                rules: 'NotEmpty'
            },
            ui: {
                form: {
                    label: 'Question',
                    type: 'input',
                },
                grid: {
                    header: 'Question',
                    align: 'left',
                    coltype: 'ro',
                    width: '*'
                }
            }
        },
        answer: {
            type: 'string',
            default: '',
            unique: false,
            validate: {
                required: true,
                mask_to_use: undefined,
                rules: 'NotEmpty'
            },
            ui: {
                form: {
                    label: 'Answer',
                    type: 'input',
                },
                grid: {
                    header: 'Answer',
                    align: 'left',
                    coltype: 'ro',
                    width: '0'
                }
            }
        }
    };


if (typeof define === 'function' && define.amd) { //AMD
    define(function() {
        return question;
    });
} else if (typeof module !== 'undefined' && module.exports) { //node
    module.exports = question;
}
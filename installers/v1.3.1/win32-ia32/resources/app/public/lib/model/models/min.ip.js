var ip={__v:$dhx.ui.mvp.model.helpers.schema.defaults.__v,_id:$dhx.ui.mvp.model.helpers.schema.defaults._id,provider:{type:"string","default":null,unique:!1,validate:{required:!0,mask_to_use:void 0,rules:"NotEmpty"},ui:{info:!1,note:"",maxLength:"",form:{label:"Provider name",type:"combo"},grid:{header:"Provider name",align:"left",coltype:"coro",width:"*"}}},number:{type:"string","default":null,unique:!0,validate:{required:!0,mask_to_use:"ip",rules:"NotEmpty"},ui:{info:!1,note:"",maxLength:"",form:{label:"IP number",type:"input"},grid:{header:"IP number",align:"left",coltype:"ro",width:"120"}}},status:{type:"string","default":null,unique:!1,validate:{required:!0,mask_to_use:void 0,rules:"NotEmpty"},ui:{info:!1,note:"",maxLength:"",form:{label:"IP status",type:"combo",options:[{value:"Available",text:"Available"},{value:"Used",text:"Used"}]},grid:{header:"IP status",align:"left",coltype:"ro",width:"120"}}}};"function"==typeof define&&define.amd?define(function(){return ip}):"undefined"!=typeof module&&module.exports&&(module.exports=ip);
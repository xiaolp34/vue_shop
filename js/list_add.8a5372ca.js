"use strict";(self["webpackChunkvue_shop"]=self["webpackChunkvue_shop"]||[]).push([[875],{2257:function(e,t,o){o.r(t),o.d(t,{default:function(){return m}});var a=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",[o("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[o("el-breadcrumb-item",{attrs:{to:{path:"/home"}}},[e._v("首页")]),o("el-breadcrumb-item",[e._v("商品管理")]),o("el-breadcrumb-item",{attrs:{to:{path:"/goods"}}},[e._v("商品列表")]),o("el-breadcrumb-item",[e._v("添加商品")])],1),o("el-card",[o("el-alert",{attrs:{title:"添加商品信息",type:"info",center:"","show-icon":""}}),o("el-steps",{attrs:{active:e.activeName-0,"finish-status":"success","align-center":""}},[o("el-step",{attrs:{title:"基本信息"}}),o("el-step",{attrs:{title:"商品参数"}}),o("el-step",{attrs:{title:"商品属性"}}),o("el-step",{attrs:{title:"商品照片"}}),o("el-step",{attrs:{title:"商品内容"}}),o("el-step",{attrs:{title:"完成",status:e.successStatus}})],1),o("el-form",{ref:"addGoodsFormRef",attrs:{model:e.addGoodsForm,rules:e.addGoodsFormRules,"label-width":"100px","label-position":"top"}},[o("el-tabs",{attrs:{"tab-position":"left","before-leave":e.beforeTabLeave},on:{"tab-click":e.tabClick},model:{value:e.activeName,callback:function(t){e.activeName=t},expression:"activeName"}},[o("el-tab-pane",{attrs:{label:"基本信息",name:"0"}},[o("el-form-item",{attrs:{label:"商品名称",prop:"goods_name"}},[o("el-input",{model:{value:e.addGoodsForm.goods_name,callback:function(t){e.$set(e.addGoodsForm,"goods_name",t)},expression:"addGoodsForm.goods_name"}})],1),o("el-form-item",{attrs:{label:"商品价格",prop:"goods_price"}},[o("el-input",{attrs:{type:"number"},model:{value:e.addGoodsForm.goods_price,callback:function(t){e.$set(e.addGoodsForm,"goods_price",t)},expression:"addGoodsForm.goods_price"}})],1),o("el-form-item",{attrs:{label:"商品重量",prop:"goods_weight"}},[o("el-input",{attrs:{type:"number"},model:{value:e.addGoodsForm.goods_weight,callback:function(t){e.$set(e.addGoodsForm,"goods_weight",t)},expression:"addGoodsForm.goods_weight"}})],1),o("el-form-item",{attrs:{label:"商品数量",prop:"goods_number"}},[o("el-input",{attrs:{type:"number"},model:{value:e.addGoodsForm.goods_number,callback:function(t){e.$set(e.addGoodsForm,"goods_number",t)},expression:"addGoodsForm.goods_number"}})],1),o("el-form-item",{attrs:{label:"商品分类",prop:"goods_cat"}},[o("el-cascader",{attrs:{options:e.cateList,props:e.cateListProps,clearable:""},on:{change:e.cateListChooseChange},model:{value:e.addGoodsForm.goods_cat,callback:function(t){e.$set(e.addGoodsForm,"goods_cat",t)},expression:"addGoodsForm.goods_cat"}})],1)],1),o("el-tab-pane",{attrs:{label:"商品参数",name:"1"}},e._l(e.manyParams,(function(t){return o("el-form-item",{key:t.attr_id,attrs:{label:t.attr_name}},[o("el-checkbox-group",{model:{value:t.attr_vals,callback:function(o){e.$set(t,"attr_vals",o)},expression:"item.attr_vals"}},e._l(t.attr_vals,(function(e,t){return o("el-checkbox",{key:t,attrs:{border:"",label:e}})})),1)],1)})),1),o("el-tab-pane",{attrs:{label:"商品属性",name:"2"}},e._l(e.onlyParams,(function(t){return o("el-form-item",{key:t.attr_id,attrs:{label:t.attr_name}},[o("el-input",{model:{value:t.attr_vals,callback:function(o){e.$set(t,"attr_vals",o)},expression:"item.attr_vals"}})],1)})),1),o("el-tab-pane",{attrs:{label:"商品照片",name:"3"}},[o("el-upload",{staticClass:"upload-demo",attrs:{action:"https://lianghj.top:8888/api/private/v1/upload","on-preview":e.handlePreview,"on-remove":e.handleRemove,"list-type":"picture",headers:e.uploadHeader,"on-success":e.uploadSuccess}},[o("el-button",{attrs:{size:"small",type:"primary"}},[e._v("点击上传")]),o("div",{staticClass:"el-upload__tip",attrs:{slot:"tip"},slot:"tip"},[e._v("只能上传jpg/png文件，且不超过500kb")])],1)],1),o("el-tab-pane",{attrs:{label:"商品内容",name:"4"}},[o("textarea"),o("el-button",{staticClass:"addBtn",attrs:{type:"primary"},on:{click:e.addGoods}},[e._v("添加商品")])],1),o("el-tab-pane",{attrs:{label:"完成",name:"5"}},[e.resultStatus?o("el-result",{attrs:{icon:"success",title:"商品添加成功",subTitle:"请返回商品列表页面进行查看"}},[o("template",{slot:"extra"},[o("el-button",{attrs:{type:"primary",size:"medium"},on:{click:e.addSuccess}},[e._v("返回商品列表")])],1)],2):o("el-result",{attrs:{icon:"warning",title:"未提交",subTitle:"请返回进行提交"}},[o("template",{slot:"extra"},[o("el-button",{attrs:{type:"primary",size:"medium"},on:{click:e.addWarning}},[e._v("返回")])],1)],2)],1)],1)],1)],1),o("el-dialog",{attrs:{title:"照片预览",visible:e.previewDialogVisible},on:{"update:visible":function(t){e.previewDialogVisible=t}}},[o("img",{staticClass:"previewImg",attrs:{src:e.previewUrl}})])],1)},r=[],s=o(6198),i=(o(1539),o(4747),o(4916),o(3123),o(4553),o(561),o(9600),o(5666),o(2611)),n=o.n(i),d={name:"Add",data:function(){return{activeName:"0",addGoodsForm:{goods_name:"",goods_price:"",goods_weight:"",goods_number:"",goods_cat:[1,3,6],pics:[],attrs:[]},addGoodsFormRules:{goods_name:[{required:!0,message:"请输入商品名称",trigger:"blur"}],goods_price:[{required:!0,message:"请输入商品价格",trigger:"blur"}],goods_weight:[{required:!0,message:"请输入商品重量",trigger:"blur"}],goods_number:[{required:!0,message:"请输入商品数量",trigger:"blur"}],goods_cat:[{required:!0,message:"请选择商品分类",trigger:"blur"}]},cateList:[],cateListProps:{expandTrigger:"hover",value:"cat_id",label:"cat_name",children:"children"},manyParams:[],onlyParams:[],uploadHeader:{Authorization:window.sessionStorage.getItem("token")},previewDialogVisible:!1,previewUrl:"",successStatus:"",resultStatus:!1}},created:function(){this.getCateList()},methods:{getCateList:function(){var e=this;return(0,s.Z)(regeneratorRuntime.mark((function t(){var o,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$http.get("categories");case 2:if(o=t.sent,a=o.data,200===a.meta.status){t.next=6;break}return t.abrupt("return",e.$message.error(a.meta.msg));case 6:e.cateList=a.data;case 7:case"end":return t.stop()}}),t)})))()},cateListChooseChange:function(){3!==this.addGoodsForm.goods_cat.length&&(this.addGoodsForm.goods_cat=[])},beforeTabLeave:function(e,t){if("0"===t&0===this.addGoodsForm.goods_cat.length)return this.$message.info("请选择先完成基本信息填写"),!1},tabClick:function(){var e=this;return(0,s.Z)(regeneratorRuntime.mark((function t(){var o,a,r,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if("1"!==e.activeName){t.next=9;break}return t.next=3,e.$http.get("categories/".concat(e.cateId,"/attributes"),{params:{sel:"many"}});case 3:if(o=t.sent,a=o.data,200===a.meta.status){t.next=7;break}return t.abrupt("return",e.$message.error(a.meta.msg));case 7:e.manyParams=a.data,e.manyParams.forEach((function(e){e.attr_vals=""===e.attr_vals?[]:e.attr_vals.split(" ")}));case 9:if("2"!==e.activeName){t.next=17;break}return t.next=12,e.$http.get("categories/".concat(e.cateId,"/attributes"),{params:{sel:"only"}});case 12:if(r=t.sent,s=r.data,200===s.meta.status){t.next=16;break}return t.abrupt("return",e.$message.error(s.meta.msg));case 16:e.onlyParams=s.data;case 17:case"end":return t.stop()}}),t)})))()},handlePreview:function(e){this.previewUrl=e.response.data.url,this.previewDialogVisible=!0},handleRemove:function(e){var t=e.response.data.tmp_path,o=this.addGoodsForm.pics.findIndex((function(e){return e.pic===t}));this.addGoodsForm.pics.splice(o,1)},uploadSuccess:function(e){if(200!==e.meta.status)return this.$message.error(e.meta.msg);this.$message.success(e.meta.msg);var t={pic:e.data.tmp_path};this.addGoodsForm.pics.push(t)},addGoods:function(){var e=this;this.$refs.addGoodsFormRef.validate(function(){var t=(0,s.Z)(regeneratorRuntime.mark((function t(o){var a,r,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(o){t.next=4;break}return e.activeName="0",e.$message.error("请填写必要信息"),t.abrupt("return");case 4:return a=n().cloneDeep(e.addGoodsForm),a.goods_cat=a.goods_cat.join(","),e.manyParams.forEach((function(e){var t={attr_id:e.attr_id,attr_value:e.attr_vals.join(" ")};a.attrs.push(t)})),e.onlyParams.forEach((function(e){var t={attr_id:e.attr_id,attr_value:e.attr_vals};a.attrs.push(t)})),a.pics=[],t.next=11,e.$http.post("goods",a);case 11:if(r=t.sent,s=r.data,201===s.meta.status){t.next=15;break}return t.abrupt("return",e.$message.error(s.meta.msg));case 15:e.$message.success(s.meta.msg),e.resultStatus=!0,e.activeName="5",e.successStatus="success";case 19:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())},addSuccess:function(){this.$router.push("/goods")},addWarning:function(){this.activeName="4"}},computed:{cateId:function(){return 3===this.addGoodsForm.goods_cat.length?this.addGoodsForm.goods_cat[2]:null}}},l=d,c=o(1001),u=(0,c.Z)(l,a,r,!1,null,"eeb309aa",null),m=u.exports},2833:function(e,t,o){o.r(t),o.d(t,{default:function(){return m}});var a=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",[o("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[o("el-breadcrumb-item",{attrs:{to:{path:"/home"}}},[e._v("首页")]),o("el-breadcrumb-item",[e._v("商品管理")]),o("el-breadcrumb-item",[e._v("商品列表")])],1),o("el-card",[o("el-row",{attrs:{gutter:20}},[o("el-col",{attrs:{span:8}},[o("el-input",{attrs:{placeholder:"请输入内容",clearable:""},on:{clear:e.getGoodsList},model:{value:e.queryInfo.query,callback:function(t){e.$set(e.queryInfo,"query",t)},expression:"queryInfo.query"}},[o("el-button",{attrs:{slot:"append",icon:"el-icon-search"},on:{click:e.getGoodsList},slot:"append"})],1)],1),o("el-col",{attrs:{span:4}},[o("el-button",{attrs:{type:"primary"},on:{click:e.addGoods}},[e._v("添加商品")])],1)],1),o("el-table",{staticStyle:{width:"100%"},attrs:{data:e.goodsList,border:"",stripe:""}},[o("el-table-column",{attrs:{type:"index",width:"40px"}}),o("el-table-column",{attrs:{prop:"goods_name",label:"商品名称"}}),o("el-table-column",{attrs:{prop:"goods_price",label:"商品价格(元)",width:"120px"}}),o("el-table-column",{attrs:{prop:"goods_weight",label:"商品重量",width:"80px"}}),o("el-table-column",{attrs:{label:"创建时间",width:"160px"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(e._f("dateFormat")(t.row.add_time))+" ")]}}])}),o("el-table-column",{attrs:{label:"操作",width:"150px"},scopedSlots:e._u([{key:"default",fn:function(t){return[o("el-button",{attrs:{type:"primary",icon:"el-icon-edit",size:"mini"},on:{click:function(o){return e.editGoodsDialog(t.row)}}}),o("el-button",{attrs:{type:"danger",icon:"el-icon-delete",size:"mini"},on:{click:function(o){return e.removeGoodsById(t.row.goods_id)}}})]}}])})],1),o("el-pagination",{attrs:{"current-page":e.queryInfo.pagenum,"page-sizes":[5,10,20,100],"page-size":e.queryInfo.pagesize,layout:"total, sizes, prev, pager, next, jumper",total:e.total,background:""},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1),o("el-dialog",{attrs:{title:"修改商品信息",visible:e.editDialogVisible,width:"45%"},on:{"update:visible":function(t){e.editDialogVisible=t},close:e.editCaterDialogClosed}},[o("el-form",{ref:"editGoodsFormRef",attrs:{model:e.editGoodsForm,rules:e.editGoodsFormRules,"label-width":"80px"}},[o("el-form-item",{attrs:{label:"商品名称",prop:"goods_name"}},[o("el-input",{model:{value:e.editGoodsForm.goods_name,callback:function(t){e.$set(e.editGoodsForm,"goods_name",t)},expression:"editGoodsForm.goods_name"}})],1),o("el-form-item",{attrs:{label:"商品价格",prop:"goods_price"}},[o("el-input",{attrs:{type:"number"},model:{value:e.editGoodsForm.goods_price,callback:function(t){e.$set(e.editGoodsForm,"goods_price",t)},expression:"editGoodsForm.goods_price"}})],1),o("el-form-item",{attrs:{label:"商品重量",prop:"goods_weight"}},[o("el-input",{attrs:{type:"number"},model:{value:e.editGoodsForm.goods_weight,callback:function(t){e.$set(e.editGoodsForm,"goods_weight",t)},expression:"editGoodsForm.goods_weight"}})],1),o("el-form-item",{attrs:{label:"商品数量",prop:"goods_number"}},[o("el-input",{attrs:{type:"number"},model:{value:e.editGoodsForm.goods_number,callback:function(t){e.$set(e.editGoodsForm,"goods_number",t)},expression:"editGoodsForm.goods_number"}})],1),o("el-form-item",{attrs:{label:"商品分类",prop:"goods_cat"}},[o("el-cascader",{staticClass:"previewImg",attrs:{options:e.cateList,props:e.cateListProps,clearable:""},on:{change:e.cateListChooseChange},model:{value:e.editGoodsForm.goods_cat,callback:function(t){e.$set(e.editGoodsForm,"goods_cat",t)},expression:"editGoodsForm.goods_cat"}})],1)],1),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:function(t){e.editDialogVisible=!1}}},[e._v("取 消")]),o("el-button",{attrs:{type:"primary"},on:{click:e.editCate}},[e._v("确 定")])],1)],1)],1)},r=[],s=o(6198),i=(o(9600),o(5666),o(2611)),n=o.n(i),d={name:"List",data:function(){return{queryInfo:{query:"",pagenum:1,pagesize:10},goodsList:[],total:0,editDialogVisible:!1,goods_id:"",editGoodsForm:{goods_name:"",goods_price:"",goods_weight:"",goods_number:"",goods_cat:[1,3,6]},editGoodsFormRules:{goods_name:[{required:!0,message:"请输入商品名称",trigger:"blur"}],goods_price:[{required:!0,message:"请输入商品价格",trigger:"blur"}],goods_weight:[{required:!0,message:"请输入商品重量",trigger:"blur"}],goods_number:[{required:!0,message:"请输入商品数量",trigger:"blur"}],goods_cat:[{required:!0,message:"请选择商品分类",trigger:"blur"}]},cateList:[],cateListProps:{expandTrigger:"hover",value:"cat_id",label:"cat_name",children:"children"}}},created:function(){this.getGoodsList(),this.getCateList()},methods:{getGoodsList:function(){var e=this;return(0,s.Z)(regeneratorRuntime.mark((function t(){var o,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$http.get("/goods",{params:e.queryInfo});case 2:if(o=t.sent,a=o.data,200===a.meta.status){t.next=6;break}return t.abrupt("return",e.$message.error(a.meta.msg));case 6:e.total=a.data.total,e.goodsList=a.data.goods;case 8:case"end":return t.stop()}}),t)})))()},handleSizeChange:function(e){this.queryInfo.pagesize=e,this.getGoodsList()},getCateList:function(){var e=this;return(0,s.Z)(regeneratorRuntime.mark((function t(){var o,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$http.get("categories");case 2:if(o=t.sent,a=o.data,200===a.meta.status){t.next=6;break}return t.abrupt("return",e.$message.error(a.meta.msg));case 6:e.cateList=a.data;case 7:case"end":return t.stop()}}),t)})))()},handleCurrentChange:function(e){this.queryInfo.pagenum=e,this.getGoodsList()},removeGoodsById:function(e){var t=this;return(0,s.Z)(regeneratorRuntime.mark((function o(){var a,r,s;return regeneratorRuntime.wrap((function(o){while(1)switch(o.prev=o.next){case 0:return o.next=2,t.$confirm("此操作将永久删除该商品, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).catch((function(e){return e}));case 2:if(a=o.sent,"cancel"!==a){o.next=5;break}return o.abrupt("return",t.$message.info("已经取消删除"));case 5:return o.next=7,t.$http.delete("/goods/".concat(e));case 7:if(r=o.sent,s=r.data,200===s.meta.status){o.next=11;break}return o.abrupt("return",t.$message.error(s.meta.msg));case 11:t.$message.success(s.meta.msg),t.getGoodsList();case 13:case"end":return o.stop()}}),o)})))()},addGoods:function(){this.$router.push("goods/add")},cateListChooseChange:function(){3!==this.editGoodsForm.goods_cat.length&&(this.editGoodsForm.goods_cat=[])},editGoodsDialog:function(e){this.editGoodsForm.goods_name=e.goods_name,this.editGoodsForm.goods_price=e.goods_price,this.editGoodsForm.goods_weight=e.goods_weight,this.editGoodsForm.goods_number=e.goods_number,this.goods_id=e.goods_id,this.editDialogVisible=!0},editCaterDialogClosed:function(){this.$refs.editGoodsFormRef.resetFields(),this.editGoodsForm.goods_name="",this.editGoodsForm.goods_price="",this.editGoodsForm.goods_weight="",this.editGoodsForm.goods_number=""},editCate:function(){var e=this;return(0,s.Z)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:e.$refs.editGoodsFormRef.validate(function(){var t=(0,s.Z)(regeneratorRuntime.mark((function t(o){var a,r,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(o){t.next=2;break}return t.abrupt("return",e.$message.error("请填写必要信息"));case 2:return a=n().cloneDeep(e.editGoodsForm),a.goods_cat=a.goods_cat.join(","),t.next=6,e.$http.put("goods/".concat(e.goods_id),a);case 6:if(r=t.sent,s=r.data,200===s.meta.status){t.next=10;break}return t.abrupt("return",e.$message.error(s.meta.msg));case 10:e.$message.success("商品修改成功"),e.editDialogVisible=!1,e.getGoodsList();case 13:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}());case 1:case"end":return t.stop()}}),t)})))()}}},l=d,c=o(1001),u=(0,c.Z)(l,a,r,!1,null,"69bc07ea",null),m=u.exports},4553:function(e,t,o){var a=o(2109),r=o(2092).findIndex,s=o(1223),i="findIndex",n=!0;i in[]&&Array(1)[i]((function(){n=!1})),a({target:"Array",proto:!0,forced:n},{findIndex:function(e){return r(this,e,arguments.length>1?arguments[1]:void 0)}}),s(i)}}]);
//# sourceMappingURL=list_add.8a5372ca.js.map
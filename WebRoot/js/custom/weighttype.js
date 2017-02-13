const WEIGHTTYPE_ITEM = 0;
const WEIGHTTYPE_LOC = 1;
var dgId;
var getUrl;
var saveUrl;
var btnEditId;
var btnSaveId;
var btnEditIdWO;
var btnSaveIdWO;

$.extend($.fn.validatebox.defaults.rules, {
    percentage: {
        validator: function(value,param){
        	var reg = /^0.[0-9]{1,2}0{0,}$/;  
            return reg.test(value);  
        },
        message: '请输入0到1之间的两位小数！'
    }
});

function getTab(tabIndex){
	if(tabIndex == WEIGHTTYPE_ITEM){
		dgId = '#dg_weighttype_item';
		getUrl = '/GetWeightTypeItem';
		saveUrl = '/SaveWeightTypeItem';
		btnEditId = '#btnEditItem';
		btnSaveId = '#btnSaveItem';
		btnEditIdWO = 'btnEditItem';
		btnSaveIdWO = 'btnSaveItem';
	}
	if(tabIndex == WEIGHTTYPE_LOC){
		dgId = '#dg_weighttype_loc';
		getUrl = '/GetWeightTypeLoc';
		saveUrl = '/SaveWeightTypeLoc';
		btnEditId = '#btnEditLoc';
		btnSaveId = '#btnSaveLoc';
		btnEditIdWO = 'btnEditLoc';
		btnSaveIdWO = 'btnSaveLoc';
	}
}

function showWeightTypeData(tabIndex){
	getTab(tabIndex);
	$(dgId).datagrid({
	    title:"出货比重",
	    url:getUrl,
	    idField:'id',
	    singleSelect:'true',
	    scrollbarSize:0,
	    striped:false,
	    rowStyler:function(index, row){
	    	return 'height:35px;'
	    },
	    toolbar:[{
	    	id:btnEditIdWO,
	    	iconCls:'icon-edit',
			text:'修改',
			handler:function(){
				editWeightType(tabIndex);
			}
		},
		{
			id:btnSaveIdWO,
			iconCls:'icon-save',
			text:'保存',
			handler:function(){
				saveWeightType(tabIndex);
			}
		}],
	    columns:[
	    	[
	        {field:'type_desc',title:'类别',width:'50%'},
	        {field:'type_percentage',title:'比例',width:'50%',
	        	editor:{
	        		type:'validatebox',
	        		options:{
	        			required:true,
	        			validType:'percentage'
	        		}
	        	}
	        }
	    ]
	    ],
	    onLoadSuccess:function(){
	    	var rows = $(dgId).datagrid('getRows');
	    	for(var i = 0; i < rows.length; i++){
	    		rows[i].type_percentage = (rows[i].type_percentage + '0').substring(0, 4); 
	    		$(dgId).datagrid('refreshRow', i);
	    	}
	    	$(btnSaveId).linkbutton("disable");
	    },
	    onSelect:function(index){
	    	$(dgId).datagrid('clearSelections');
	    }
	});
}

function editWeightType(tabIndex){
	getTab(tabIndex);
	var rowCount = $(dgId).datagrid('getRows').length;
	for(var i = 0; i < rowCount; i++){
		$(dgId).datagrid('beginEdit', i);
	}
	$(btnEditId).linkbutton("disable");
	$(btnSaveId).linkbutton("enable");
}

function saveWeightType(tabIndex){
	getTab(tabIndex);
	var rowCount = $(dgId).datagrid('getRows').length;
	var row = $(dgId).datagrid('getRows');
	var isValid = true;
	var totalPercentage = 0;
	var validBoxValue = 0;
	var dataJson = {"wt":[]};
	var dataJson_temp;
	var jsonStr=""

	for(var i = 0; i < rowCount; i++){
		validBoxValue = $($(dgId).datagrid('getEditor', {index:i,field:'type_percentage'}).target).val();
		if(!$(dgId).datagrid('validateRow', i)){
			isValid = false;
		}
		totalPercentage = totalPercentage + parseFloat(validBoxValue);
	}
	if(totalPercentage != 1){
		$.messager.alert('系统消息','所有类别比例总和必须为1!','info');
		isValid = false;
	}
	if(isValid){
		for(var i = 0; i < rowCount; i++){
			validBoxValue = $($(dgId).datagrid('getEditor', {index:i,field:'type_percentage'}).target).val();
			validBoxValue = (validBoxValue + '00').substring(0, 4);
			$($(dgId).datagrid('getEditor', {index:i,field:'type_percentage'}).target).val(validBoxValue);
			$(dgId).datagrid('endEdit', i);
			dataJson_temp = {"id":row[i].id, "type_percentage":row[i].type_percentage};
			dataJson.wt.push(dataJson_temp);
		}
		jsonStr = JSON.stringify(dataJson);
		$.post(saveUrl,jsonStr,function(data){
			if(data.result){
				$(btnEditId).linkbutton("enable");
				$(btnSaveId).linkbutton("disable");
			}
			else{
				
			}			
			showMsg(data.msg);
		}
		);		
	}
}

function showMsg(msg){
	$.messager.show({
		title:'系统消息',
		msg:msg,
		timeout:2000,
		showType:'slide'
	});
}
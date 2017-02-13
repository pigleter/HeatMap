package com.heatmap.managerment;

import java.io.BufferedReader;
import java.util.ArrayList;
import java.util.List;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;

import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;
import com.heatmap.model.WeightTypeItem;
import com.heatmap.model.WeightTypeLoc;

public class HeatMapController extends Controller {
	public void WeightType(){
		render("/WEB-INF/page/weighttype.html");
	}
	
	public void GetWeightTypeItem(){
		List<WeightTypeItem> wt = WeightTypeItem.dao.find("select * from z_heatmap_weighttype_item");
		renderJson(wt);
	}
	
	public void GetWeightTypeLoc(){
		List<WeightTypeLoc> wt = WeightTypeLoc.dao.find("select * from z_heatmap_weighttype_loc");
		renderJson(wt);
	}
	
	public void SaveWeightTypeItem(){	
		try{
			StringBuilder json = new StringBuilder(); 
			BufferedReader reader = this.getRequest().getReader();
			String line = null;
			while((line = reader.readLine()) != null){
				json.append(line);
			}
			reader.close();
			JSONArray jasonarray = JSON.parseObject(json.toString()).getJSONArray("wt");
			
			ArrayList<String> updateSql = new ArrayList<String>();
			String sql;
			for(int i = 0; i < jasonarray.size(); i++){
				sql = "update z_heatmap_weighttype_item set type_percentage = " + jasonarray.getJSONObject(i).getString("type_percentage") + " where id = " + jasonarray.getJSONObject(i).getString("id") + ";";
				updateSql.add(sql);
			}
			Db.batch(updateSql, jasonarray.size());
			renderJson("{\"result\":true, \"msg\":\"更新成功！\"}");
		}
		catch(Exception e){
			renderJson("{\"result\":false, \"msg\":\"更新失败！发生异常：" + e.getMessage() + "\"}");
		}		
		
	}
	
	public void SaveWeightTypeLoc(){	
		try{
			StringBuilder json = new StringBuilder(); 
			BufferedReader reader = this.getRequest().getReader();
			String line = null;
			while((line = reader.readLine()) != null){
				json.append(line);
			}
			reader.close();
			JSONArray jasonarray = JSON.parseObject(json.toString()).getJSONArray("wt");
			
			ArrayList<String> updateSql = new ArrayList<String>();
			String sql;
			for(int i = 0; i < jasonarray.size(); i++){
				sql = "update z_heatmap_weighttype_loc set type_percentage = " + jasonarray.getJSONObject(i).getString("type_percentage") + " where id = " + jasonarray.getJSONObject(i).getString("id") + ";";
				updateSql.add(sql);
			}
			Db.batch(updateSql, jasonarray.size());
			renderJson("{\"result\":true, \"msg\":\"更新成功！\"}");
		}
		catch(Exception e){
			renderJson("{\"result\":false, \"msg\":\"更新失败！发生异常：" + e.getMessage() + "\"}");
		}		
		
	}
}

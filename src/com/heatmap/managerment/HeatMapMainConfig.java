package com.heatmap.managerment;

import com.heatmap.model.WeightTypeItem;
import com.heatmap.model.WeightTypeLoc;
import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.JFinalConfig;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.core.JFinal;
import com.jfinal.kit.PropKit;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.jfinal.plugin.c3p0.C3p0Plugin;
import com.jfinal.render.ViewType;

public class HeatMapMainConfig extends JFinalConfig {

	@Override
	public void configConstant(Constants me) {
		me.setViewType(ViewType.JSP);
		PropKit.use("config.properties");
	}

	@Override
	public void configRoute(Routes me) {
		me.add("/", HeatMapController.class);

	}

	@Override
	public void configPlugin(Plugins me) {
		C3p0Plugin C3p0Plugin = new C3p0Plugin(PropKit.get("jdbcUrl"), PropKit.get("user"), PropKit.get("password"));
		ActiveRecordPlugin arp = new ActiveRecordPlugin(C3p0Plugin);
		arp.setShowSql(true);
		arp.addMapping("z_heatmap_weighttype_item", WeightTypeItem.class);
		arp.addMapping("z_heatmap_weighttype_loc", WeightTypeLoc.class);
		me.add(C3p0Plugin);
		me.add(arp);
	}

	@Override
	public void configInterceptor(Interceptors me) {

	}

	@Override
	public void configHandler(Handlers me) {

	}
	
	public static void main(String[] args) {
		JFinal.start("WebRoot", 8080, "/", 5);
	}

}

import React, { useEffect } from "react";
import { AdvancedRealTimeChartProps } from "react-ts-tradingview-widgets";
import BitqueryOHLCChart from "./BitqueryOHLCChart";
import { TokenPairInfo } from "@/types";

interface Props {
  onLoaded: () => void;
  tokenPairInfo: TokenPairInfo;
  setDataUnavailable: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TokenGraphChart: React.FC<Props> = ({ onLoaded, tokenPairInfo, setDataUnavailable }) => {
  const config = {
    theme: "dark",
    calendar: false,
    autosize: true,
    withdateranges: true,
    hide_legend: true,
    hide_side_toolbar: true,
    disabled_features: [
      "header_widget",
      "header_widget_dom_node",
      "header_symbol_search",
      "symbol_search_hot_key",
      "header_resolutions",
      "header_interval_dialog_button",
      "show_interval_dialog_on_key_press",
      "header_chart_type",
      "header_settings",
      "header_indicators",
      "header_compare",
      "header_undo_redo",
      "header_screenshot",
      "header_fullscreen_button",
      "compare_symbol",
      "border_around_the_chart",
      "header_saveload",
      "left_toolbar",
      "control_bar",
      "timeframes_toolbar",
      "show_hide_button_in_legend",
      "format_button_in_legend",
      "study_buttons_in_legend",
      "delete_button_in_legend",
      "context_menus",
      "pane_context_menu",
      "scales_context_menu",
      "legend_context_menu",
      "main_series_scale_menu",
      "display_market_status",
      "remove_library_container_border",
      "chart_property_page_style",
      "property_pages",
      "show_chart_property_page",
      "chart_property_page_scales",
      "chart_property_page_background",
      "chart_property_page_timezone_sessions",
      "chart_property_page_trading",
      "countdown",
      "caption_buttons_text_if_possible",
      "dont_show_boolean_study_arguments",
      "hide_last_na_study_output",
      "symbol_info",
      "timezone_menu",
      "snapshot_trading_drawings",
      "source_selection_markers",
      "go_to_date",
      "adaptive_logo",
      "show_dom_first_time",
      "hide_left_toolbar_by_default",
      "items_favoriting",
      "save_chart_properties_to_local_storage",
      "create_volume_indicator_by_default",
      "create_volume_indicator_by_default_once",
      "volume_force_overlay",
      "right_bar_stays_on_scroll",
      "constraint_dialogs_movement",
      "charting_library_debug_mode",
      "show_dialog_on_snapshot_ready",
      "study_market_minimized",
      "study_dialog_search_control",
      "side_toolbar_in_fullscreen_mode",
      "same_data_requery",
      "chart_scroll",
      "chart_zoom",
      "high_density_bars",
      "cl_feed_return_all_data",
      "uppercase_instrument_names",
      "no_min_chart_width",
      "fix_left_edge",
      "lock_visible_time_range_on_resize",
      "study_templates",
      "datasource_copypaste",
      "seconds_resolution",
    ],
  } as AdvancedRealTimeChartProps;

  useEffect(() => {
    var parentDiv = document.getElementById("tradingview_widget_wrapper");

    var childDiv = parentDiv?.children[1];

    childDiv && parentDiv?.removeChild(childDiv);
  }, []);

  return (
    // <div className="h-full">
    //   {token && <AdvancedRealTimeChart style="8" {...config} symbol={token} />}
    // </div>
    <BitqueryOHLCChart onLoaded={onLoaded} tokenPairInfo={tokenPairInfo} setDataUnavailable={setDataUnavailable}/>
  );
};

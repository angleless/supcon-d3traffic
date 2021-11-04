import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, array, object, number, boolean, color, select } from '@storybook/addon-knobs'
import Induction from '../../src/lib/Induction'
// const a = { "isError": false, "data": [{ "start_lng": 121.502991, "start_lat": 31.240801, "end_lng": 121.505127, "end_lat": 31.242146, "data_version": "20191231", "lane_cnt": 3, "road_level": 44000, "start_cross_id": "152HM09H2O0", "start_cross_name": "东园路与陆家嘴环路路口", "start_geohash": "wtw3sz5ybg", "end_cross_id": "152IB09H350", "end_cross_name": "百步街与陆家嘴环路路口", "end_geohash": "wtw3szmqdw", "len": 238.0, "lnglat_seq": "121.50306304,31.24078153;121.50350504,31.24106011;121.5036188,31.24112876;121.5036188,31.24112876;121.50396484,31.24132676;121.50427114,31.24152623;121.50427114,31.24152623;121.50443226,31.24162288;121.50443226,31.24162288;121.50445728,31.24164007;121.50507795,31.2420593", "rid_seq": "152HM09H2O0152HS09H2R00,152HS09H2R0152I309H2V00,152I309H2V0152IB09H3500", "cross_id_seq": "152HM09H2O0,152HS09H2R0,152I309H2V0,152IB09H350", "start_date": "2020-06-11 08:53:20", "lnglat_wkt": null, "rdseg_name": "东园路与陆家嘴环路路口#百步街与陆家嘴环路路口", "rdseg_id": "152HM09H2O0#152IB09H350" }, { "start_lng": 121.505127, "start_lat": 31.242146, "end_lng": 121.505127, "end_lat": 31.242146, "data_version": "20191231", "lane_cnt": 2, "road_level": 45000, "start_cross_id": "152IB09H350", "start_cross_name": "百步街与陆家嘴环路路口", "start_geohash": "wtw3szmqdw", "end_cross_id": "152IB09H350", "end_cross_name": "百步街与陆家嘴环路路口", "end_geohash": "wtw3szmqdw", "len": 49.0, "lnglat_seq": "121.50524316,31.24215719;121.50530418,31.24219732;121.50534575,31.24231084;121.50534575,31.24231084;121.50519957,31.2422902;121.50507016,31.2422214", "rid_seq": "152IB09H350152IB09H3500", "cross_id_seq": "152IB09H350,152IB09H350", "start_date": "2020-06-11 08:53:20", "lnglat_wkt": null, "rdseg_name": "百步街与陆家嘴环路路口#百步街与陆家嘴环路路口", "rdseg_id": "152IB09H350#152IB09H350" }, { "start_lng": 121.505127, "start_lat": 31.242146, "end_lng": 121.506447, "end_lat": 31.240351, "data_version": "20191231", "lane_cnt": 3, "road_level": 44000, "start_cross_id": "152IB09H350", "start_cross_name": "百步街与陆家嘴环路路口", "start_geohash": "wtw3szmqdw", "end_cross_id": "152IO09H2K0", "end_cross_name": "银城中路与陆家嘴环路路口", "end_geohash": "wtw3sznk1r", "len": 225.0, "lnglat_seq": "121.50507795,31.2420593;121.50516244,31.24194464;121.50561842,31.24131055;121.50561842,31.24131055;121.50632786,31.24033706", "rid_seq": "152IB09H350152IO09H2K00", "cross_id_seq": "152IB09H350,152IO09H2K0", "start_date": "2020-06-11 08:53:20", "lnglat_wkt": null, "rdseg_name": "百步街与陆家嘴环路路口#银城中路与陆家嘴环路路口", "rdseg_id": "152IB09H350#152IO09H2K0" }, { "start_lng": 121.5037, "start_lat": 31.240015, "end_lng": 121.506447, "end_lat": 31.240351, "data_version": "20191231", "lane_cnt": 2, "road_level": 44000, "start_cross_id": "152HT09H2G0", "start_cross_name": "东园路交叉口", "start_geohash": "wtw3szh632", "end_cross_id": "152IO09H2K0", "end_cross_name": "银城中路与陆家嘴环路路口", "end_geohash": "wtw3sznk1r", "len": 704.0, "lnglat_seq": "121.50367326,31.23999743;121.5037444,31.2399222;121.5037444,31.2399222;121.50416405,31.23946369;121.50430593,31.23932104;121.50430593,31.23932104;121.50439523,31.23921677;121.50440576,31.23919904;121.5044295,31.23914792;121.50443205,31.23913851;121.50443205,31.23913851;121.50443878,31.23911378;121.50444116,31.23909159;121.50443629,31.23903694;121.50443205,31.23902441;121.50443205,31.23902441;121.50442469,31.23900266;121.50441283,31.2389829;121.50424408,31.23877608;121.50419898,31.238704;121.50414238,31.23855574;121.50414238,31.23855574;121.50406581,31.23838476;121.50400353,31.23822423;121.50394147,31.23799217;121.50390415,31.23780798;121.50390415,31.23780798;121.5038873,31.23772483;121.50388602,31.23766784;121.50389505,31.23763441;121.50390371,31.23761824;121.50393049,31.23758823;121.50395538,31.23757196;121.50400611,31.23755538;121.50404434,31.23755489;121.50406528,31.23755894;121.50425217,31.23763386;121.50425217,31.23763386;121.50440972,31.23830539;121.50443199,31.23836465;121.50443199,31.23836465;121.50450202,31.23849402;121.50459689,31.23862331;121.50471272,31.23875244;121.50496365,31.23898383;121.50506953,31.2391798;121.50506953,31.2391798;121.50511065,31.23921171;121.50564869,31.23962929;121.50600351,31.23989513;121.50617278,31.24002968;121.50640744,31.2402289", "rid_seq": "152HT09H2G0152I109H2200,152I109H220152IB09H2800,152IB09H280152IO09H2K00", "cross_id_seq": "152HT09H2G0,152I109H220,152IB09H280,152IO09H2K0", "start_date": "2020-06-11 08:53:20", "lnglat_wkt": null, "rdseg_name": "东园路交叉口#银城中路与陆家嘴环路路口", "rdseg_id": "152HT09H2G0#152IO09H2K0" }, { "start_lng": 121.505127, "start_lat": 31.242146, "end_lng": 121.502991, "end_lat": 31.240801, "data_version": "20191231", "lane_cnt": 3, "road_level": 44000, "start_cross_id": "152IB09H350", "start_cross_name": "百步街与陆家嘴环路路口", "start_geohash": "wtw3szmqdw", "end_cross_id": "152HM09H2O0", "end_cross_name": "东园路与陆家嘴环路路口", "end_geohash": "wtw3sz5ybg", "len": 250.0, "lnglat_seq": "121.50507016,31.2422214;121.50472612,31.24198033;121.50443227,31.24178619;121.50443227,31.24178619;121.50428356,31.24168679;121.50428356,31.24168679;121.50369079,31.24130726;121.50369079,31.24130726;121.50300157,31.24087076;121.50298671,31.24086061", "rid_seq": "152IB09H350152HM09H2O00", "cross_id_seq": "152IB09H350,152HM09H2O0", "start_date": "2020-06-11 08:53:20", "lnglat_wkt": null, "rdseg_name": "百步街与陆家嘴环路路口#东园路与陆家嘴环路路口", "rdseg_id": "152IB09H350#152HM09H2O0" }, { "start_lng": 121.5037, "start_lat": 31.240015, "end_lng": 121.502991, "end_lat": 31.240801, "data_version": "20191231", "lane_cnt": 3, "road_level": 44000, "start_cross_id": "152HT09H2G0", "start_cross_name": "东园路交叉口", "start_geohash": "wtw3szh632", "end_cross_id": "152HM09H2O0", "end_cross_name": "东园路与陆家嘴环路路口", "end_geohash": "wtw3sz5ybg", "len": 104.0, "lnglat_seq": "121.50372356,31.24003412;121.50306304,31.24078153", "rid_seq": "152HT09H2G0152HM09H2O00", "cross_id_seq": "152HT09H2G0,152HM09H2O0", "start_date": "2020-06-11 08:53:20", "lnglat_wkt": null, "rdseg_name": "东园路交叉口#东园路与陆家嘴环路路口", "rdseg_id": "152HT09H2G0#152HM09H2O0" }, { "start_lng": 121.502991, "start_lat": 31.240801, "end_lng": 121.5037, "end_lat": 31.240015, "data_version": "20191231", "lane_cnt": 2, "road_level": 44000, "start_cross_id": "152HM09H2O0", "start_cross_name": "东园路与陆家嘴环路路口", "start_geohash": "wtw3sz5ybg", "end_cross_id": "152HT09H2G0", "end_cross_name": "东园路交叉口", "end_geohash": "wtw3szh632", "len": 104.0, "lnglat_seq": "121.50299877,31.24073886;121.50352284,31.24016036;121.50367326,31.23999743", "rid_seq": "152HM09H2O0152HT09H2G00", "cross_id_seq": "152HM09H2O0,152HT09H2G0", "start_date": "2020-06-11 08:53:20", "lnglat_wkt": null, "rdseg_name": "东园路与陆家嘴环路路口#东园路交叉口", "rdseg_id": "152HM09H2O0#152HT09H2G0" }, { "start_lng": 121.502991, "start_lat": 31.240801, "end_lng": 121.501408, "end_lat": 31.239594, "data_version": "20191231", "lane_cnt": 3, "road_level": 44000, "start_cross_id": "152HM09H2O0", "start_cross_name": "东园路与陆家嘴环路路口", "start_geohash": "wtw3sz5ybg", "end_cross_id": "152H609H2C0", "end_cross_name": "陆家嘴环路交叉口", "end_geohash": "wtw3syfxu4", "len": 200.0, "lnglat_seq": "121.5029296,31.24082164;121.50276068,31.24070475;121.50243579,31.24047967;121.50243579,31.24047967;121.50213824,31.24028482;121.50198323,31.2401778;121.50177398,31.24001942;121.50167224,31.23993208;121.5015393,31.2398001;121.50143132,31.23968348;121.50137293,31.23961889", "rid_seq": "152HM09H2O0152H609H2C00", "cross_id_seq": "152HM09H2O0,152H609H2C0", "start_date": "2020-06-11 08:53:20", "lnglat_wkt": null, "rdseg_name": "东园路与陆家嘴环路路口#陆家嘴环路交叉口", "rdseg_id": "152HM09H2O0#152H609H2C0" }, { "start_lng": 121.5050735474, "start_lat": 31.2422218323, "end_lng": 121.5043411255, "end_lat": 31.2432689667, "data_version": "20191231", "lane_cnt": -1, "road_level": 45000, "start_cross_id": "152IB09H350", "start_cross_name": "百步街与陆家嘴环路路口", "start_geohash": "wtw3szmr1k", "end_cross_id": "152I309H3H0", "end_cross_name": "滨江大道与百步街路口", "end_geohash": "wtw3szsv0r", "len": 136.0, "lnglat_seq": "121.50507016,31.2422214;121.50494059,31.24245144;121.50482747,31.24262722;121.50482747,31.24262722;121.50449804,31.24306466;121.50449804,31.24306466;121.50448435,31.24308286;121.50447272,31.24309832;121.50443238,31.24315191;121.50443238,31.24315191;121.5043411,31.24326921", "rid_seq": "152IB09H350152I309H3H00", "cross_id_seq": "152IB09H350,152I309H3H0", "start_date": "2020-06-11 08:53:35", "lnglat_wkt": null, "rdseg_name": "百步街", "rdseg_id": "152IB09H350152I309H3H00" }, { "start_lng": 121.5050811768, "start_lat": 31.2420597076, "end_lng": 121.5050811768, "end_lat": 31.2420597076, "data_version": "20191231", "lane_cnt": -1, "road_level": 44000, "start_cross_id": "152IB09H350", "start_cross_name": "百步街与陆家嘴环路路口", "start_geohash": "wtw3szmq1w", "end_cross_id": "152IB09H350", "end_cross_name": "百步街与陆家嘴环路路口", "end_geohash": "wtw3szmq1w", "len": 2953.7632431742, "lnglat_seq": "121.50507795,31.2420593;121.50516244,31.24194464;121.50561842,31.24131055;121.50561842,31.24131055;121.50632786,31.24033706;121.50640744,31.2402289;121.50679737,31.23964584;121.50679737,31.23964584;121.50709576,31.23925956;121.50709576,31.23925956;121.50738416,31.23891655;121.50738416,31.23891655;121.50748488,31.23878835;121.50758882,31.238598;121.50758882,31.238598;121.5078406,31.2381365;121.50794555,31.23791688;121.50814268,31.23754445;121.50814268,31.23754445;121.50830663,31.23727028;121.50844744,31.23699967;121.50860306,31.23669744;121.50874303,31.23633394;121.5088689,31.23594657;121.50894811,31.23564492;121.50901746,31.23520968;121.50904776,31.23467643;121.50904776,31.23467643;121.509045,31.234473;121.509082,31.233684;121.509068,31.233577;121.50904,31.23349;121.50900783,31.23343266;121.508987,31.23340499;121.50896371,31.23338974;121.50891281,31.23337119;121.50891281,31.23337119;121.50881397,31.23333263;121.50870492,31.23329628;121.50861628,31.23326777;121.50824268,31.2331753;121.50724822,31.23291054;121.507078,31.23286497;121.50690425,31.23281994;121.50675993,31.23279227;121.50658524,31.23276731;121.50512179,31.23264756;121.50443152,31.23260198;121.50443152,31.23260198;121.50426308,31.23258814;121.50419138,31.23258095;121.50351797,31.23253282;121.50351797,31.23253282;121.50301427,31.23249043;121.50282339,31.2327063;121.5027375,31.23279693;121.5023044,31.23334075;121.5022346,31.23343079;121.5022346,31.23343079;121.5021633,31.2335228;121.5021633,31.2335228;121.50157471,31.23426408;121.5015291,31.23431626;121.50133043,31.23452587;121.50121241,31.2346543;121.50114804,31.23472999;121.50105913,31.23486375;121.50105913,31.23486375;121.501051,31.234876;121.500941,31.235109;121.500843,31.235353;121.500799,31.235497;121.500759,31.235716;121.50072894,31.23594559;121.50072894,31.23594559;121.50072264,31.23605749;121.50072264,31.23605749;121.50071905,31.23615735;121.50071905,31.23615735;121.5006982,31.23642781;121.50069405,31.23663638;121.50069405,31.23663638;121.500686,31.23697121;121.500686,31.23697121;121.50064979,31.23746772;121.50064979,31.23746772;121.50063123,31.23799804;121.50076736,31.2384392;121.50077876,31.23853724;121.50078479,31.23859343;121.50079955,31.23863356;121.50086268,31.23875619;121.50086268,31.23875619;121.50103814,31.23904296;121.50119689,31.23927243;121.50119689,31.23927243;121.50133382,31.23944769;121.50141155,31.23953474;121.50144406,31.23957114;121.50150824,31.23964301;121.50165719,31.23979089;121.50165719,31.23979089;121.50171278,31.23984293;121.50183669,31.23994955;121.50205485,31.24011474;121.50218491,31.24019795;121.50218491,31.24019795;121.5024612,31.24038547;121.50249713,31.24040899;121.50249713,31.24040899;121.50299877,31.24073886;121.50306304,31.24078153;121.50350504,31.24106011;121.5036188,31.24112876;121.50396484,31.24132676;121.50427114,31.24152623;121.50443226,31.24162288;121.50443226,31.24162288;121.50445728,31.24164007;121.50507795,31.2420593", "rid_seq": "152IB09H350152IO09H2K00,152IO09H2K0152JE09H0C00,152JE09H0C0152IU09H0800,152IU09H080152I209H0500,152I209H050152HM09H0400,152HM09H040152H709H0N00,152H709H0N0152GU09H1C00,152GU09H1C0152GT09H1U00,152GT09H1U0152H609H2C00,152H609H2C0152HM09H2O00,152HM09H2O0152HS09H2R00,152HS09H2R0152I309H2V00,152I309H2V0152IB09H3500", "cross_id_seq": "152IB09H350,152IO09H2K0,152JE09H0C0,152IU09H080,152I209H050,152HM09H040,152H709H0N0,152GU09H1C0,152GT09H1U0,152H609H2C0,152HM09H2O0,152HS09H2R0,152I309H2V0,152IB09H350", "start_date": "2020-06-11 08:53:35", "lnglat_wkt": null, "rdseg_name": "陆家嘴环路", "rdseg_id": "152IB09H350152IB09H3500" }, { "start_lng": 121.5046310425, "start_lat": 31.2406349182, "end_lng": 121.5054016113, "end_lat": 31.239774704, "data_version": "20191231", "lane_cnt": -1, "road_level": 45000, "start_cross_id": "152I609H2M0", "start_cross_name": "东回路交叉口", "start_geohash": "wtw3szhvzh", "end_cross_id": "152IE09H2E0", "end_cross_name": "东回路与银城中路路口", "end_geohash": "wtw3szj8ch", "len": 124.0, "lnglat_seq": "121.50463088,31.24063427;121.50481475,31.24044836;121.50482012,31.24042772;121.50481744,31.24039791;121.50480671,31.24037154;121.50480671,31.2403509;121.50481475,31.24033255;121.50540341,31.23977379", "rid_seq": "152I609H2M0152IE09H2E00", "cross_id_seq": "152I609H2M0,152IE09H2E0", "start_date": "2020-06-11 08:53:35", "lnglat_wkt": null, "rdseg_name": "东回路", "rdseg_id": "152I609H2M0152IE09H2E00" }, { "start_lng": 121.5050735474, "start_lat": 31.2422218323, "end_lng": 121.509475708, "end_lat": 31.2329330444, "data_version": "20191231", "lane_cnt": -1, "road_level": 44000, "start_cross_id": "152IB09H350", "start_cross_name": "百步街与陆家嘴环路路口", "start_geohash": "wtw3szmr1k", "end_cross_id": "152JN09H090", "end_cross_name": "浦城路与陆家嘴环路路口", "end_geohash": "wtw3tjb3pb", "len": 1983.0868048095, "lnglat_seq": "121.50507016,31.2422214;121.50472612,31.24198033;121.50443227,31.24178619;121.50443227,31.24178619;121.50428356,31.24168679;121.50428356,31.24168679;121.50369079,31.24130726;121.50369079,31.24130726;121.50300157,31.24087076;121.50298671,31.24086061;121.5029296,31.24082164;121.50276068,31.24070475;121.50243579,31.24047967;121.50243579,31.24047967;121.50213824,31.24028482;121.50198323,31.2401778;121.50177398,31.24001942;121.50167224,31.23993208;121.5015393,31.2398001;121.50143132,31.23968348;121.50137293,31.23961889;121.50134542,31.23958846;121.50124988,31.23948225;121.50110504,31.23932172;121.50110504,31.23932172;121.50103128,31.2392082;121.50087437,31.23895479;121.50074428,31.23873234;121.50074428,31.23873234;121.50070002,31.23863946;121.50065778,31.23858958;121.50060356,31.23852213;121.50045708,31.23799858;121.50050192,31.23791658;121.50054102,31.23781855;121.50056125,31.23770688;121.50056565,31.2376285;121.50056565,31.2376285;121.50057069,31.2373368;121.50057069,31.2373368;121.50057671,31.23698866;121.50057823,31.23696788;121.50057823,31.23696788;121.50058638,31.23663283;121.50058638,31.23663283;121.50059275,31.23643644;121.50060957,31.23614197;121.50060957,31.23614197;121.50061374,31.2360485;121.50062026,31.23592531;121.5006372,31.2357382;121.5006874,31.2354874;121.50070044,31.23544388;121.50070044,31.23544388;121.50074,31.235312;121.50083,31.235101;121.50097162,31.23482436;121.50097162,31.23482436;121.50098,31.234808;121.5010706,31.2346692;121.50126549,31.23443828;121.50138217,31.23432704;121.50145668,31.23425835;121.50150611,31.23420965;121.50153917,31.23417127;121.50205454,31.2334689;121.50205454,31.2334689;121.50245955,31.23293509;121.50245955,31.23293509;121.5029048,31.23242881;121.50306305,31.23240931;121.50331661,31.23242851;121.50373235,31.23245259;121.50420342,31.23248332;121.50427437,31.23248734;121.50443151,31.2324951;121.50443151,31.2324951;121.505186,31.232555;121.5058352,31.23259937;121.5058352,31.23259937;121.5065889,31.23266359;121.50695036,31.23269597;121.50711896,31.23272852;121.50829388,31.2330161;121.50841098,31.23304467;121.50841098,31.23304467;121.50860108,31.23309107;121.50868108,31.23311542;121.5088273,31.23314457;121.50890263,31.233155;121.50890263,31.233155;121.50892735,31.23315843;121.50895002,31.23315735;121.50895526,31.23315711;121.50904604,31.23315251;121.50912254,31.23313841;121.50920934,31.23311291;121.50928476,31.23307222;121.50934877,31.2330299;121.50941117,31.2329827;121.50947247,31.23293387", "rid_seq": "152IB09H350152HM09H2O00,152HM09H2O0152H609H2C00,152H609H2C0152GT09H1U00,152GT09H1U0152GU09H1C00,152GU09H1C0152H709H0N00,152H709H0N0152HM09H0400,152HM09H040152I209H0500,152I209H050152IU09H0800,152IU09H080152JE09H0C00,152JE09H0C0152JN09H0900", "cross_id_seq": "152IB09H350,152HM09H2O0,152H609H2C0,152GT09H1U0,152GU09H1C0,152H709H0N0,152HM09H040,152I209H050,152IU09H080,152JE09H0C0,152JN09H090", "start_date": "2020-06-11 08:53:35", "lnglat_wkt": null, "rdseg_name": "陆家嘴环路", "rdseg_id": "152IB09H350152JN09H0900" }, { "start_lng": 121.506447, "start_lat": 31.240351, "end_lng": 121.505127, "end_lat": 31.242146, "data_version": "20191231", "lane_cnt": 4, "road_level": 44000, "start_cross_id": "152IO09H2K0", "start_cross_name": "银城中路与陆家嘴环路路口", "start_geohash": "wtw3sznk1r", "end_cross_id": "152IB09H350", "end_cross_name": "百步街与陆家嘴环路路口", "end_geohash": "wtw3szmqdw", "len": 221.0, "lnglat_seq": "121.50648565,31.24047595;121.50621347,31.24082938;121.5061055,31.24095877;121.505946,31.24115382;121.50574428,31.24143266;121.50574428,31.24143266;121.50569264,31.24150261;121.50569264,31.24150261;121.50524316,31.24215719", "rid_seq": "152IO09H2K0152IB09H3500", "cross_id_seq": "152IO09H2K0,152IB09H350", "start_date": "2020-06-11 08:53:20", "lnglat_wkt": null, "rdseg_name": "银城中路与陆家嘴环路路口#百步街与陆家嘴环路路口", "rdseg_id": "152IO09H2K0#152IB09H350" }, { "start_lng": 121.5054016113, "start_lat": 31.239774704, "end_lng": 121.5046310425, "end_lat": 31.2406349182, "data_version": "20191231", "lane_cnt": -1, "road_level": 45000, "start_cross_id": "152IE09H2E0", "start_cross_name": "东回路与银城中路路口", "start_geohash": "wtw3szj8ch", "end_cross_id": "152I609H2M0", "end_cross_name": "东回路交叉口", "end_geohash": "wtw3szhvzh", "len": 124.0, "lnglat_seq": "121.50540341,31.23977379;121.50481475,31.24033255;121.50480671,31.2403509;121.50480671,31.24037154;121.50481744,31.24039791;121.50482012,31.24042772;121.50481475,31.24044836;121.50463088,31.24063427", "rid_seq": "152IE09H2E0152I609H2M00", "cross_id_seq": "152IE09H2E0,152I609H2M0", "start_date": "2020-06-11 08:53:35", "lnglat_wkt": null, "rdseg_name": "东回路", "rdseg_id": "152IE09H2E0152I609H2M00" }], "code": "0000", "message": "成功" }
const a = { "isError": false, "data": [{ "start_lng": "121.490639", "start_lat": "31.231319", "end_lng": "121.493065", "end_lat": "31.232014", "data_version": "20191231", "lane_cnt": "1", "road_level": "45000", "start_cross_id": "152DQ09GVP0", "start_cross_name": "四川南路与金陵东路路口", "start_geohash": "wtw3st6z95", "end_cross_id": "152EJ09H000", "end_cross_name": "中山东二路与金陵东路路口", "wtw3sx4tbg": null, "len": "239.0", "lnglat_seq": "121.49064165,31.23131894;121.49149835,31.23154155;121.49149835,31.23154155;121.49253866,31.23181603;121.49253866,31.23181603;121.49262075,31.23183769;121.49270006,31.2318684", "rid_seq": "152DQ09GVP0152E309GVR00,152E309GVR0152EJ09H0000", "cross_id_seq": "152DQ09GVP0,152E309GVR0,152EJ09H000", "start_date": "2020-06-17 18:56:34", "lnglat_wkt": null, "rdseg_name": "四川南路与金陵东路路口#中山东二路与金陵东路路口", "rdseg_id": "152DQ09GVP0#152EJ09H000" }, { "start_lng": "121.490639", "start_lat": "31.231319", "end_lng": "121.489746", "end_lat": "31.23106", "data_version": "20191231", "lane_cnt": "1", "road_level": "45000", "start_cross_id": "152DQ09GVP0", "start_cross_name": "四川南路与金陵东路路口", "start_geohash": "wtw3st6z95", "end_cross_id": "152DH09GVN0", "end_cross_name": "溪口路与金陵东路路口", "wtw3sx4tbg": null, "len": "90.0", "lnglat_seq": "121.49064165,31.23131894;121.49043344,31.23127019;121.48974356,31.23105934", "rid_seq": "152DQ09GVP0152DH09GVN00", "cross_id_seq": "152DQ09GVP0,152DH09GVN0", "start_date": "2020-06-17 18:56:34", "lnglat_wkt": null, "rdseg_name": "四川南路与金陵东路路口#溪口路与金陵东路路口", "rdseg_id": "152DQ09GVP0#152DH09GVN0" }, { "start_lng": "121.4915008545", "start_lat": "31.2315406799", "end_lng": "121.4922561646", "end_lat": "31.2294578552", "data_version": "20191231", "lane_cnt": "-1", "road_level": "45000", "start_cross_id": "152E309GVR0", "start_cross_name": "永安路与金陵东路路口", "start_geohash": "wtw3ste2vj", "end_cross_id": "152EC09GV60", "end_cross_name": "人民路与永安路路口", "wtw3sx4tbg": null, "len": "242.0", "lnglat_seq": "121.49149835,31.23154155;121.49158162,31.23132645;121.49158162,31.23132645;121.49165075,31.23114789;121.49165075,31.23114789;121.49177528,31.23082626;121.49177528,31.23082626;121.49179875,31.23076565;121.49179875,31.23076565;121.49196609,31.23026654;121.49196609,31.23026654;121.49225975,31.22945784", "rid_seq": "152E309GVR0152EC09GV600", "cross_id_seq": "152E309GVR0,152EC09GV60", "start_date": "2020-06-17 18:56:40", "lnglat_wkt": null, "rdseg_name": "永安路", "rdseg_id": "152E309GVR0152EC09GV600" }, { "start_lng": "121.490639", "start_lat": "31.231319", "end_lng": "121.482941", "end_lat": "31.22826", "data_version": "20191231", "lane_cnt": "2", "road_level": null, "start_cross_id": "152DQ09GVP0", "start_cross_name": "四川南路与金陵东路路口", "start_geohash": "wtw3st6z95", "end_cross_id": "152BD09GUR0", "end_cross_name": "浙江南路与金陵东路路口", "wtw3sx4tbg": null, "len": "10309.0", "lnglat_seq": "121.49064165,31.23131894;121.49043344,31.23127019;121.48974356,31.23105934;121.48974356,31.23105934;121.48939526,31.23092757;121.48924503,31.23087938;121.48924503,31.23087938;121.4888135,31.23074095;121.48871846,31.23070897;121.48871846,31.23070897;121.48823672,31.23055073;121.48823672,31.23055073;121.4874726,31.23029975;121.4874726,31.23029975;121.48701489,31.23016567;121.48684718,31.23012553;121.48655172,31.23003018;121.48655172,31.23003018;121.48629924,31.22996259;121.48615463,31.22991307;121.48593428,31.22980958;121.48593428,31.22980958;121.48566586,31.22967191;121.48566586,31.22967191;121.48531296,31.2294932;121.48510741,31.2293859;121.48510741,31.2293859;121.48461164,31.22912784;121.48461164,31.22912784;121.48445635,31.22904548;121.48445635,31.22904548;121.48379371,31.22870009;121.48368149,31.22864209;121.48368149,31.22864209;121.48359547,31.22859764;121.48348107,31.22853852;121.48348107,31.22853852;121.48294377,31.22826086", "rid_seq": "152DQ09GVP0152DH09GVN00,152DH09GVN0152D709GVJ00,152D709GVJ0152CR09GVF00,152CR09GVF0152CL09GVD00,152CL09GVD0152CH09GVC00,152CH09GVC0152C909GV900,152C909GV90152C309GV600,152C309GV60152BT09GV200,152BT09GV20152BD09GUR00", "cross_id_seq": "152DQ09GVP0,152DH09GVN0,152D709GVJ0,152CR09GVF0,152CL09GVD0,152CH09GVC0,152C909GV90,152C309GV60,152BT09GV20,152BD09GUR0", "start_date": "2020-06-17 18:56:50", "lnglat_wkt": "", "rdseg_name": "金陵东路:金门路-山东南路路段", "rdseg_id": "54bfa3d3cefa81e9b4a5d7ba4fad6d02" }], "code": "0000", "message": "成功" }
const mockData1 = {
  // must 当前道路前进方向
  direction: {
    name: 'N',
    position: [0, 0]
  },
  // translates:[10,20],
  flowIsVisible: true, // 是否显示路况颜色, 不传时组件默认显示
  roadNameIsVisible: true, // 是否显示道路名称，不传时组件默认显示
  // must
  roads: [
    {
      rid: 'r1',
      // width: 14, // 支持传入，组件有默认值
      name: {
        text: '文一西路',
        x: '',
        y: '',
        canDelete: false
        // 以下支持传入，组件有默认值
        // color: '#ff0',
        // fontSize: 20,
        // fontFamily: 'SimSun',
        // letterSpacing: 0
        // backgrounColor: ''
      },
      zIndex: 10, // 展示层级，默认都是0，值大的显示在上
      level: 1, // 国道，省道 同等zIndex下level值小的显示在上
      type: 0, // 普通，隧道，修路，禁止左转 ，用于显示不同类型UI
      endArrow: false, // 端头箭头
      visible: true,
      sections: [ // 多余属性可
        {
          sectionId: 'r1-1',
          start: [45, 66],
          end: [77, 66],
          flow: 'R', // 道路路况颜色(R|G|Y)，不传时组件默认E(灰色)
          visible: true
        },
        {
          sectionId: 'r1-2',
          start: [77, 66],
          end: [190, 66],
          flow: 'R', // 道路路况颜色(R|G|Y)，不传时组件默认E(灰色)
          visible: true
        },
        {
          sectionId: 'r1-3',
          start: [190, 66],
          end: [282, 66],
          flow: 'R', // 道路路况颜色(R|G|Y)，不传时组件默认E(灰色)
          visible: true,
        },
        {
          sectionId: 'r1-4',
          start: [282, 66],
          end: [357, 66],
          flow: 'R', // 道路路况颜色(R|G|Y)，不传时组件默认E(灰色)
          visible: true
        }
      ]
    },
    {
      rid: 'r2',
      // width: 10, // 支持传入，组件有默认值
      name: {
        text: '文二西路',
        x: '',
        y: '',
        canDelete: false
        // 以下支持传入，组件有默认值
        // color: '#fff',
        // fontSize: 16,
        // fontFamily: 'SimSun',
        // letterSpacing: 0,
        // backgrounColor: ''
      },
      zIndex: 4, // 展示层级，默认都是0，值大的显示在上
      level: 1, // 国道，省道 同等zIndex下level值小的显示在上
      type: 0, // 普通，隧道，修路，禁止左转 ，用于显示不同类型UI
      endArrow: false, // 端头箭头
      sections: [
        {
          sectionId: 'r2-1',
          start: [136, 218],
          end: [140, 175],
          flow: 'Y' // 道路路况颜色(R|G|Y)，不传时组件默认E(灰色)
        },
        {
          sectionId: 'r2-2',
          start: [140, 175],
          end: [156, 150],
          flow: 'Y' // 道路路况颜色(R|G|Y)，不传时组件默认E(灰色)
        }
      ]
    },
    {
      rid: 'r3',
      // width: 10, // 支持传入，组件有默认值
      name: {
        text: '文三西路东',
        x: '',
        y: '',
        canDelete: false
        // 以下支持传入，组件有默认值
        // color: '#fff',
        // fontSize: 16,
        // fontFamily: 'SimSun',
        // letterSpacing: 0
      },
      zIndex: 6, // 展示层级，默认都是0，值大的显示在上
      level: 1, // 国道，省道 同等zIndex下level值小的显示在上
      type: 0, // 普通，隧道，修路，禁止左转 ，用于显示不同类型UI
      endArrow: false, // 端头箭头
      sections: [
        {
          sectionId: 'r3-1',
          start: [77, 43],
          end: [77, 148],
          flow: 'G' // 道路路况颜色(R|G|Y)，不传时组件默认E(灰色)
        },
        {
          sectionId: 'r3-2',
          start: [77, 148],
          end: [77, 218],
          flow: 'G' // 道路路况颜色(R|G|Y)，不传时组件默认E(灰色)
        }
      ]
    },
    {
      rid: 'r4',
      // width: 8, // 支持传入，组件有默认值
      name: {
        text: '文四西路',
        x: '',
        y: '',
        canDelete: false
        // 以下支持传入，组件有默认值
        // color: '#fff',
        // fontSize: 16,
        // fontFamily: 'SimSun',
        // letterSpacing: 0,
        // backgrounColor: ''
      },
      zIndex: 8, // 展示层级，默认都是0，值大的显示在上
      level: 1, // 国道，省道 同等zIndex下level值小的显示在上
      type: 0, // 普通，隧道，修路，禁止左转 ，用于显示不同类型UI
      endArrow: false, // 端头箭头
      sections: [
        {
          sectionId: 'r4-1',
          // start: [190, 43],
          // end: [300, 150],
          // start: [190, 43],
          // end: [300, 50],
          // start: [190, 43],
          // end: [230, 55],

          start: [190, 43],
          end: [190, 150],

          // start: [190, 43],
          // end: [70, 143],
          // start: [190, 43],
          // end: [70, 53],
          // start: [190, 43],
          // end: [170, 103],

          // start: [190, 43],
          // end: [70, 43],

          // start: [170, 143],
          // end: [80, 43],
          // start: [170, 143],
          // end: [70, 103],
          // start: [170, 63],
          // end: [100, 43],

          // start: [190, 150],
          // end: [190, 43],

          // start: [190, 150],
          // end: [250, 43],
          // start: [190, 150],
          // end: [270, 123],
          // start: [190, 190],
          // end: [200, 170],
          flow: 'G' // 道路路况颜色(R|G|Y)，不传时组件默认E(灰色)
        }
      ]
    },
    {
      rid: 'r5',
      // width: 18, // 支持传入，组件有默认值
      name: {
        text: '文五西路',
        x: '',
        y: '',
        canDelete: false
        // 以下支持传入，组件有默认值
        // color: '#fff',
        // fontSize: 16,
        // fontFamily: 'SimSun',
        // letterSpacing: 0
      },
      zIndex: 5, // 展示层级，默认都是0，值大的显示在上
      level: 4, // 国道，省道 同等zIndex下level值小的显示在上
      type: 0, // 普通，隧道，修路，禁止左转 ，用于显示不同类型UI
      endArrow: false, // 端头箭头
      sections: [
        {
          sectionId: 'r5-1',
          start: [282, 265],
          end: [282, 25],
          flow: 'G' // 道路路况颜色(R|G|Y)，不传时组件默认E(灰色)
        }
      ]
    },
    {
      rid: 'r6',
      // width: 18, // 支持传入，组件有默认值
      name: {
        text: '文六西路',
        x: '',
        y: '',
        canDelete: false
        // 以下支持传入，组件有默认值
        // color: '#fff',
        // fontSize: 16,
        // fontFamily: 'SimSun',
        // letterSpacing: 0,
        // backgrounColor: ''
      },
      zIndex: 0, // 展示层级，默认都是0，值大的显示在上
      level: 1, // 国道，省道 同等zIndex下level值小的显示在上
      type: 0, // 普通，隧道，修路，禁止左转 ，用于显示不同类型UI
      endArrow: false, // 端头箭头
      sections: [
        {
          sectionId: 'r6-1',
          start: [355, 218],
          end: [45, 218],
          flow: 'Y' // 道路路况颜色(R|G|Y)，不传时组件默认E(灰色)
        }
      ]
    },
    {
      rid: 'r7',
      // width: 18, // 支持传入，组件有默认值
      name: {
        text: '文七西路',
        x: '',
        y: '',
        canDelete: false
        // 以下支持传入，组件有默认值
        // color: '#fff',
        // fontSize: 16,
        // fontFamily: 'SimSun',
        // letterSpacing: 0,
        // backgrounColor: ''
      },
      zIndex: 5, // 展示层级，默认都是0，值大的显示在上
      level: 2, // 国道，省道 同等zIndex下level值小的显示在上
      type: 0, // 普通，隧道，修路，禁止左转 ，用于显示不同类型UI
      endArrow: false, // 端头箭头
      sections: [
        {
          sectionId: 'r7-1',
          start: [75, 148],
          end: [190, 148],
          visible: true,
          flow: 'Y' // 道路路况颜色(R|G|Y)，不传时组件默认E(灰色)
        },
        {
          sectionId: 'r7-2',
          start: [190, 148],
          end: [285, 148],
          visible: true,
          flow: 'Y' // 道路路况颜色(R|G|Y)，不传时组件默认E(灰色)
        }
      ]
    }
  ],
  // optional, default []",
  markers: [
    {
      type: 'HERE', // 当前位置
      positions: [250, 245]
      // 以下支持传入，组件有默认值
      // fontSize: 16,
      // fontFamily: 'SimSun',
      // color: '#fff',
      // text: '现在位置',
    }
  ],
  images: [
    {
      src: 'control.png', // 道路管控
      size: [30, 30],
      position: [266, 150]
    }
  ],
  routes: [
    {
      name: '诱导路线信息1',
      id: 1,
      path: ['r3-1', 'r7-1', 'r1-1'],
      visible: true,
      value: '20分钟'
    },
    {
      name: '诱导路线信息2',
      id: 2,
      path: ['r1-1', 'r1-2', 'r1-3'],
      visible: true,
      value: '30分钟'
    }
  ],
  // optional, default []",
  // texts: [ // 文字信息, 默认都可删除
  //   {
  //     id: 1,
  //     text: '武林广场', // 不支持换行
  //     x: 25,
  //     y: 10,
  //     // color: '#ff0',
  //     fontSize: 22,
  //     // fontFamily: 'SimSun',
  //     // letterSpacing: 0,
  //     canDelete: false
  //   },
  //   {
  //     id: 2,
  //     text: '预计时间',
  //     x: 25,
  //     y: 45,
  //     // color: '#ff0',
  //     fontSize: 14,
  //     // fontFamily: 'SimSun',
  //     // letterSpacing: 0
  //     canDelete: false
  //   },
  //   {
  //     id: 3,
  //     text: '20分钟',
  //     x: 27,
  //     y: 68,
  //     color: '#000',
  //     routeId: 1,
  //     fontSize: 18,
  //     // fontFamily: 'SimSun',
  //     // letterSpacing: 0,
  //     backgroundColor: '#fff',
  //     canDelete: false
  //   },
  //   {
  //     id: 4,
  //     text: '西溪园区', // 不支持换行
  //     x: 300,
  //     y: 10,
  //     // color: '#ff0',
  //     fontSize: 22,
  //     // fontFamily: 'SimSun',
  //     // letterSpacing: 0,
  //     canDelete: false
  //   },
  //   {
  //     id: 5,
  //     text: '预计时间',
  //     x: 300,
  //     y: 45,
  //     // color: '#ff0',
  //     fontSize: 14,
  //     // fontFamily: 'SimSun',
  //     // letterSpacing: 0
  //     canDelete: false
  //   },
  //   {
  //     id: 6,
  //     text: '30分钟',
  //     x: 300,
  //     y: 68,
  //     color: '#000',
  //     routeId: 2,
  //     fontSize: 18,
  //     // fontFamily: 'SimSun',
  //     // letterSpacing: 0,
  //     backgroundColor: '#fff',
  //     canDelete: false,
  //     canEdit: false
  //   }
  // ],
  polygon:'0,300;400,300,400,0;0,0'
}
const b = a.data.map(item => {
  const { rid_seq, rdseg_id, rdseg_name, start_lng, start_lat, end_lng, end_lat } = item
  return {
    rid: rid_seq,
    leve: 1,
    zIndex: 10,
    visible: true,
    name: {
      text: rdseg_name,
    },
    sections: [
      {
        sectionId: rdseg_id,
        start: [start_lng, start_lat],
        end: [end_lng, end_lat],
        flow: 'R', // 道路路况颜色(R|G|Y)，不传时组件默认E(灰色)
        visible: true
      }
    ]
  }
})
const mockData = {
  roadNameIsVisible: true,
  flowIsVisible: true,
  roads: b,
  texts: [ // 文字信息, 默认都可删除
    {
      id: 10,
      text: '武林广场2', // 不支持换行
      x: 25,
      y: 10,
      // color: '#ff0',
      fontSize: 22,
      // fontFamily: 'SimSun',
      // letterSpacing: 0,
      canDelete: false
    }
  ],
  polygon: "121.490437,31.231471;121.491017,31.229784;121.492138,31.230178;121.491526,31.231742;121.490437,31.231471"
}
let induction = ''
let induction2 = ''
let induction3 = ''
let routes = [
  {
    name: '路线1',
    id: 1,
    path: ['r3-1', 'r7-1', 'r1-1'],
    visible: true,
    value: '20分钟'
  },
  {
    name: '路线2',
    id: 2,
    path: ['r1-1', 'r1-2', 'r1-3'],
    visible: true,
    value: '30分钟'
  }
]
storiesOf('Induction', module)
  // .addDecorator(withKnobs)
  .add('default NO_SCALE', () => <div style={{ margin: 20 }}>
    <div style={{ display: 'flex', 'justifyContent': 'space-around' }}>
      {/* <div>
        <div style={{ overflow: 'hidden' }}>
          <Induction
            debug={false}
            preview={false}
            screenWidth={number('screenWidth', 400)}
            screenHeight={number('screenHeight', 300)}
            mapWidth={number('mapWidth', 400)}
            mapHeight={number('mapHeight', 300)}
            background={color('背景色', '#1e1e1e')}
            ref={el => induction = el}
            data={object('data', mockData)}
            textsDefault={{
              color: '#fff',
              fontSize: 18,
              fontFamily: 'Arial',
              letterSpacing: 0,
              canDelete: true,
              canEdit: true,
              visible: true
            }}
            getAddRouteData={(data) => {
              console.log('getAddRouteData', data);
            }}
            getTextStyle={(data) => {
              console.log('getTextStyle', data);
            }}
            onDeleteKeyDown={(data) => {
              console.log('onDeleteKeyDown', data);
            }}
            getAllData={(data) => {
              console.log('getAllData', data)
            }}
          />
        </div>
        <div>是否开启预览态<input
          type='checkbox'
          defaultChecked={true}
          onChange={e => {
            induction.setPreview(e.target.checked)
          }}
        />
        </div>
        <div>是否显示道路名称<input
          type='checkbox'
          defaultChecked={mockData1.roadNameIsVisible}
          onChange={e => {
            console.log('induction', induction);
            induction.setRoadNameVisible({ visible: e.target.checked })
          }}
        />
        </div>
        <div>是否显示路况 <input
          type='checkbox'
          defaultChecked={mockData1.flowIsVisible}
          onChange={e => {
            induction.setFlowVisible({ visible: e.target.checked })
          }}
        />
        </div>
        <div>
          <div style={{ marginRight: 40 }} onClick={() => { induction.addText({ open: true }) }}>开始输入文本</div>
          <div onClick={() => { induction.addText({ open: false }) }}>结束输入文本</div>
        </div>
        <div>
          <div onClick={() => {
            induction.setTextStyle({
              id: induction.getCurrentTextId(),
              style: { letterSpacing: 6 }
            })
          }}>更改字体间距为6</div>
          <div onClick={() => {
            induction.setTextStyle({
              id: induction.getCurrentTextId(),
              style: { fontSize: 24 }
            })
          }}>更改字体大小为24</div>
          <div onClick={() => {
            induction.setTextStyle({
              id: induction.getCurrentTextId(),
              style: { color: '#f00' }
            })
          }}>
            更改颜色为红色
          </div>
          <div onClick={() => {
            induction.setTextStyle({
              id: induction.getCurrentTextId(),
              style: { backgroundColor: '#0f0' }
            })
          }}>
            更改背景色为绿色
          </div>
        </div>
        <div>
          {
            routes.map(item => {
              return <div style={{ display: 'flex', 'justifyContent': 'space-around' }} key={item.id}>
                {item.name}
                <div onClick={() => { induction.setEditRouteId({ routeId: item.id }) }}>编辑{item.name}</div>
                <div onClick={() => { induction.delRoute({ routeId: item.id }) }}> 删除{item.name}</div>
                <div onClick={() => {
                  induction.setRouteVisible({
                    routeId: item.id,
                    visible: false
                  })
                }}>
                  {item.name}不可见
                </div>
                <div onClick={() => {
                  induction.setRouteVisible({
                    routeId: item.id,
                    visible: true
                  })
                }}>
                  {item.name}可见
                </div>
              </div>
            })
          }
        </div>
        <div style={{ display: 'flex', 'justifyContent': 'space-around' }}>
          <div onClick={() => { induction.addRoute({ open: true }) }}>添加路线</div>
          <div onClick={() => {
            console.log('获取到保存路线数据为===>', induction.getRouteData({ routeId: induction.getCurrentRouteId() }))
          }}>
            获取当前编辑或者添加的路线数据
          </div>
        </div>
        <div>
          <button onClick={() => {
            induction.addImage({
              src: 'http://via.placeholder.com/30',
              size: [30, 30],
              position: [66, 100]
            })
          }}>添加图片</button>
          <button onClick={() => { induction.handleSaveJpg() }}>保存为图片</button>
          <button onClick={() => {
            console.log('获取到全部数据为===>', induction.getInductionData())
            induction.setInductionData({ data: induction.getInductionData() })
          }}>获取全部数据</button>
        </div>
      </div> */}
      <div>
        <div style={{ overflow: 'hidden' }}>
          <Induction
            debug={false}
            preview={false}
            screenWidth={number('screenWidth', 400)}
            screenHeight={number('screenHeight', 300)}
            mapWidth={number('mapWidth', 400)}
            mapHeight={number('mapHeight', 300)}
            // scaleMode={'SHOW_ALL'}
            // scaleMode={'EXACT_FIT'}
            background={color('背景色', '#1e1e1e')}
            textsDefault={{
              color: '#fff',
              fontSize: 18,
              fontFamily: 'Arial',
              letterSpacing: 0,
              canDelete: true,
              canEdit: true,
              visible: true
            }}
            ref={el => induction2 = el}
            data={object('data', mockData)}
            getAddRouteData={(data) => {
              routes.push(data)
              console.log('getAddRouteData', data);
            }}
            getTextStyle={(data) => {
              console.log('getTextStyle', data);
            }}
            onDeleteKeyDown={(data) => {
              console.log('onDeleteKeyDown', data);
            }}
          />
        </div>
        <div>是否开启预览态<input
          type='checkbox'
          defaultChecked={false}
          onChange={e => {
            induction2.setPreview(e.target.checked)
          }}
        />
        </div>
        <div>是否显示道路名称<input
          type='checkbox'
          defaultChecked={mockData.roadNameIsVisible}
          onChange={e => {
            induction2.setRoadNameVisible({ visible: e.target.checked })
          }}
        />
        </div>
        <div>是否显示路况 <input
          type='checkbox'
          defaultChecked={mockData.flowIsVisible}
          onChange={e => {
            induction2.setFlowVisible({ visible: e.target.checked })
          }}
        />
        </div>
        <div style={{ marginRight: 40 }} onClick={() => { induction2.addText({ open: true }) }}>开始输入文本</div>
        <div onClick={() => { induction2.addText({ open: false }) }}>结束输入文本</div>
        <div>
          <div onClick={() => {
            induction2.setTextStyle({
              id: induction2.getCurrentTextId(),
              style: { letterSpacing: 6 }
            })
          }}>更改字体间距为6</div>
          <div onClick={() => {
            induction2.setTextStyle({
              id: induction2.getCurrentTextId(),
              style: { fontSize: 24 }
            })
          }}>更改字体大小为24</div>
          <div onClick={() => {
            induction2.setTextStyle({
              id: induction2.getCurrentTextId(),
              style: { color: '#f00' }
            })
          }}>
            更改颜色为红色
          </div>
          <div onClick={() => {
            induction2.setTextStyle({
              id: induction2.getCurrentTextId(),
              style: { backgroundColor: '#0f0' }
            })
          }}>
            更改背景色为绿色
          </div>
        </div>
        {
          routes.map(item => {
            return <div style={{ display: 'flex', 'justifyContent': 'space-around' }} key={item.id}>
              {item.name}
              <div onClick={() => { induction2.setEditRouteId({ routeId: item.id }) }}>编辑{item.name}</div>
              <div onClick={() => { induction2.delRoute({ routeId: item.id }) }}>删除{item.name}</div>
              <div onClick={() => {
                induction2.setRouteVisible({
                  routeId: item.id,
                  visible: false
                })
              }}>
                {item.name}不可见
              </div>
              <div onClick={() => {
                induction2.setRouteVisible({
                  routeId: item.id,
                  visible: true
                })
              }}>
                {item.name}可见
              </div>
            </div>
          })
        }
        <div style={{ display: 'flex', 'justifyContent': 'space-around' }}>
          <div onClick={() => { induction2.addRoute({ open: true }) }}>添加路线</div>
          <div onClick={() => {
            const routeId = induction2.getCurrentRouteId()
            const routeData = induction2.getRouteData({ routeId: routeId })
            console.log('获取到保存路线数据为===>', induction2.getRouteData({ routeId: routeId }))
            induction2.insertText({
              id: Date.now(),
              text: '50分钟',
              x: routeData[0].x,
              y: routeData[0].y,
              color: '#000',
              routeId: routeId,
              fontSize: 18,
              // fontFamily: 'SimSun',
              // letterSpacing: 0,
              backgroundColor: '#fff',
              canDelete: false,
              canEdit: false,
              visible: true
            })
          }}>
            获取当前编辑或者添加的路线数据
          </div>
        </div>
        <div> 
          <button onClick={() => {
            induction2.addImage({
              src: 'http://via.placeholder.com/30',
              size: [30, 30],
              position: [66, 100]
            })
          }}>添加图片</button>
          <button onClick={() => { induction2.handleSaveJpg() }}>保存为图片</button>
          <button onClick={() => {
            console.log('获取到全部数据为===>', induction2.getInductionData())
            induction2.setInductionData({ data: induction2.getInductionData() })
          }}>获取全部数据</button>
          <button onClick={() => {
            induction2.setInductionData({ data: mockData1 })
          }}>恢复默认值</button>
        </div>
      </div>
    </div>
  </div>)

storiesOf('Induction', module)
  .add('大尺寸 NO_SCALE', () => <div>
    <Induction
      screenWidth={600}
      screenHeight={450}
      mapWidth={400}
      mapHeight={300}
      scaleMode={'NO_SCALE'}
      data={mockData}
    />
  </div>)
storiesOf('Induction', module)
  .add('小尺寸 NO_SCALE', () => <div>
    <Induction
      screenWidth={300}
      screenHeight={200}
      mapWidth={400}
      mapHeight={300}
      scaleMode={'NO_SCALE'}
      data={mockData}
    />
  </div>)
storiesOf('Induction', module)
  .add('default SHOW_ALL', () => <div>
    <Induction
      screenWidth={400}
      screenHeight={300}
      mapWidth={400}
      mapHeight={300}
      scaleMode={'SHOW_ALL'}
      data={mockData}
    />
  </div>)
storiesOf('Induction', module)
  .add('大尺寸 SHOW_ALL', () => <div>
    <Induction
      screenWidth={900}
      screenHeight={700}
      mapWidth={400}
      mapHeight={300}
      scaleMode={'SHOW_ALL'}
      data={mockData}
    />
  </div>)
storiesOf('Induction', module)
  .add('小尺寸 SHOW_ALL', () => <div>
    <div>
      <Induction
        debug={false}
        preview={false}
        screenWidth={300}
        screenHeight={200}
        mapWidth={400}
        mapHeight={300}
        scaleMode={'SHOW_ALL'}
        data={mockData}
        ref={el => induction3 = el}
      />
    </div>
    <button onClick={() => {
      console.log('获取到全部数据为===>', induction3.getInductionData())
      induction3.setInductionData({ data: induction3.getInductionData() })
    }}>获取全部数据</button>
    <button onClick={() => {
      induction3.setInductionData({ data: mockData })
    }}>恢复默认值</button>
  </div>)

storiesOf('Induction', module)
  .add('正尺寸 SHOW_ALL', () => <div>
    <Induction
      screenWidth={200}
      screenHeight={200}
      mapWidth={400}
      mapHeight={300}
      scaleMode={'SHOW_ALL'}
      data={mockData}
    />
  </div>)
storiesOf('Induction', module)
  .add('default EXACT_FIT', () => <div>
    <Induction
      screenWidth={400}
      screenHeight={300}
      mapWidth={400}
      mapHeight={300}
      scaleMode={'EXACT_FIT'}
      data={mockData}
    />
  </div>)
storiesOf('Induction', module)
  .add('大尺寸 EXACT_FIT', () => <div>
    <Induction
      screenWidth={600}
      screenHeight={700}
      mapWidth={400}
      mapHeight={300}
      scaleMode={'EXACT_FIT'}
      data={mockData}
    />
  </div>)
storiesOf('Induction', module)
  .add('小尺寸 EXACT_FIT', () => <div>
    <Induction
      screenWidth={300}
      screenHeight={200}
      mapWidth={400}
      mapHeight={300}
      scaleMode={'EXACT_FIT'}
      data={mockData}
    />
  </div>)

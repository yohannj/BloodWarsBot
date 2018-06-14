// ==UserScript==
// @name        BloodWars atk and quest
// @namespace   atkAndQuest@bw
// @include     http://r*.fr.bloodwars.net*
// @include     https://r*.fr.bloodwars.net*
// @version     1
// @grant       GM.xmlHttpRequest
// @grant       GM.getValue
// @grant       GM.setValue
// ==/UserScript==

//******************* Global variables - DO NOT TOUCH *******************

const __GM3REQUEST = (('undefined' !== typeof GM_xmlhttpRequest) ? GM_xmlhttpRequest : undefined);  // GM 3.x and earlier
const __GM4REQUEST = (('undefined' !== typeof GM)                ? GM.xmlHttpRequest : undefined);  // GM 4.0+
const __CHECKFUN   = (fun => (('function' === typeof fun) ? fun : undefined));

const __XMLREQUEST = (__CHECKFUN(__GM4REQUEST) || __CHECKFUN(__GM4REQUEST));

//var ME = /class="me".*?>(.*?)</.exec(document.body.innerHTML)[1];
var SERV = /r(\d+)\.fr/.exec(window.location.href)[1];
var BASE_URL = /^(.*\.net)/.exec(window.location.href)[1];
var ATK_PAGE_URL = BASE_URL + '/?a=ambush&opt=atk';
var ARMOURY_PAGE_URL = BASE_URL + '/?a=equip';
var ARMOURY_ITEMS_FIRST_PAGE_URL = BASE_URL + '/_ajaxLoadArmoryItems.php?type=equip&page=1';
var ARMOURY_ITEMS_SECOND_PAGE_URL = BASE_URL + '/_ajaxLoadArmoryItems.php?type=equip&page=2';
var AUCTION_PAGE_URL = BASE_URL + '/?a=auction&do=itemlist';
var CLAN_PAGE_URL = BASE_URL + '/?a=aliance';
var EXPE_PAGE_URL = BASE_URL + '/?a=cevent';
var EXPE_JOIN_PAGE_URL = BASE_URL + '/?a=cevent&do=current';
var EXPE_CLOSE_PAGE_URL = BASE_URL + '/?a=cevent&do=current&togrec';
var EXPE_LAUNCH_PAGE_MAP_2_URL = BASE_URL + '/?a=cevent&do=new&chtier=2';
var EXPE_SACRIFICE_PAGE_MAP_2_URL = BASE_URL + '/?a=cevent&do=sacrifice&chtier=2';
var EXPE_UPDATE_DESC_URL = BASE_URL + '/_ajaxEditActionDesc.php';
var MAIN_URL = BASE_URL + '/?a=main';
var PROFILE_PAGE_URL = BASE_URL + '/?a=profile&uid=';
var QUEST_PAGE_URL = BASE_URL + '/?a=quest';
var SWR_PAGE_URL = BASE_URL + '/?a=swr';
var SWR_JOIN_PAGE_URL = BASE_URL + '/?a=swr&do=current';
var SWR_CLOSE_PAGE_URL = BASE_URL + '/?a=swr&do=current&togrec';
var SWR_LAUNCH_PAGE_URL = BASE_URL + '/?a=swr&do=new';
var SWR_UPDATE_DESC_URL = BASE_URL + '/_ajaxEditActionDesc.php';
var TOWNSHOP_PAGE_URL = BASE_URL + '/?a=townshop';
var ARENA_1_V_1_PAGE_URL = BASE_URL + '/?a=newarena&cat=1';
var ARENA_3_V_3_PAGE_URL = BASE_URL + '/?a=newarena&cat=2';
var ARENA_3_V_3_JOIN_PAGE_URL = BASE_URL + '/?a=newarena&cat=2&do=current';
var ARENA_3_V_3_LAUNCH_PAGE_URL = BASE_URL + '/?a=newarena&cat=2&do=new';
var ARENA_3_V_3_CLOSE_PAGE_URL = BASE_URL + '/?a=newarena&cat=2&do=current&togrec';
var ARENA_3_V_3_UPDATE_DESC_URL = BASE_URL + '/_ajaxEditActionDesc.php';
var ARENA_CLAN_V_CLAN_PAGE_URL = BASE_URL + '/?a=newarena&cat=3';
var CONNECTION_PAGE_URL = BASE_URL + '/';

var MIN_TEMPO = 2500;
var MIN_LOL = 80000;
var JUNK_PRICE = 20000;
var SECONDS_IN_MS = 1000;
var FOURTY_SECONDS_IN_MS = 40 * SECONDS_IN_MS;
var MINUTE_IN_S = 60;
var FOUR_MINUTES_IN_MS = 4 * MINUTE_IN_S * SECONDS_IN_MS;
var FIVE_MINUTES_IN_MS = 5 * MINUTE_IN_S * SECONDS_IN_MS;
var FIFTEEN_MINUTES_IN_MS = 15 * MINUTE_IN_S * SECONDS_IN_MS;
var HOUR_IN_S = 3600;
var INTERVAL_AUCTION_CHECK_TIME = 90 * MINUTE_IN_S * SECONDS_IN_MS;
var DAY_IN_S = 24 * HOUR_IN_S;
var MIN_INTERVAL_BETWEEN_ARENA_CHECK = 6 * HOUR_IN_S * SECONDS_IN_MS;
var MIN_INTERVAL_BETWEEN_DECONNECTED_DESTUFF_CHECK = 15 * MINUTE_IN_S * SECONDS_IN_MS;
var MIN_INTERVAL_BETWEEN_EVENT_CHECK = 150 * SECONDS_IN_MS;
var MARGIN_COEF = 1025;
var DECIMAL_BASE = 10;

var ARK_MAP = {
  'Masque d`Adonis': 1,
  'Masque de Caligula': 2,
  'Frénésie Sauvage': 3,
  'Peau de Bête': 4,
  'Sang de la Vie': 5,
  'Voies Félines': 6,
  'Silence du Sang': 7,
  'Absorption de la Force': 8,
  'La Majesté': 9,
  'L`Ombre de la Bête': 10,
  'L`Ardeur du Sang': 11,
  'Le pouvoir du Sang': 12,
  'Le Chasseur de la Nuit': 13,
  'Le Souffle Mortel': 14,
  'L`Horreur': 15
};
var EVO_MAP = {
  'Les Ailes': 1,
  'Carapace': 2,
  'Canines/Griffes/Pointes': 3,
  'Glandes à venin': 4,
  'Tendons renforcés': 5,
  'Mutation ADN': 8,
  'Eclairé': 9,
  'Sixième sens': 10,
  'Absorption': 11,
  'Développement Harmonieux': 12,
  'L`empreinte du démon': 21
};
var OUU_LIST = [
  {
    id: 12,
    name: 'Ouu +10 chance'
  },
  {
    id: 27,
    name: 'Ouu +15 chance'
  },
  {
    id: 42,
    name: 'Ouu +20 chance'
  }
];
var EXPE_SITE = {
  'La Tour Blanche': 1,
  'Le Désert De La Désespérance': 2,
  'Le Désert D`Efermeh': 3,
  'L`Oasis Des Geysers': 4,
  'La Grande Steppe': 5,
  'La Tour D`Or': 6,
  'Le Doigt Du Diable': 7,
  'Le Désert D`Efermeh II': 8,
  'Les Marécages Lapidaires': 9,
  'L`Abîme Des Araignées': 10,
  'La Grande Steppe II': 11,
  'Les Monts De La Sagesse': 12,
  'Le Désert Des Carapaces': 13,
  'Les Monts du Changement': 14,
  'Le Temple De La Mort': 15,
  'Les Champs Des Os': 16,
  'Le Cercle De Cronos': 17,
  'Champs de lave': 21,
  'Les Canaux': 22,
  'Salle de tortures': 23,
  'Voie d`assassins': 24,
  'L`artefact mystérieux': 25,
  'Nid de bestioles': 26,
  'Grande déchiqueteuse': 27,
  'Le cimetière des impies': 28,
  'L`arbre des sentences': 29,
  'Lac des noyés': 30,
  'La bibliothèque brulée': 31,
  'Obélisque': 32,
  'La salle des polymorphes': 33,
  'Terre pustulée': 34,
  'La fierté des défenseurs': 35
};
var RDC_SITE = {
  'Banlieues': 1,
  'La Forteresse de l`Horace': 2,
  'Petite porte': 3,
  'La Forgerie': 4,
  'Le Marché': 5,
  'L`Hôpital': 6,
  'Le Stock du carburant': 7,
  'La Citadelle': 8
};

var OUU_NAME_BY_ID = {};
for (var i = 0; i < OUU_LIST.length; i++) {
    OUU_NAME_BY_ID[OUU_LIST[i].id] = OUU_LIST[i].name;
}

var currentAccessKey;

var atkRunning = false;
var questRunning = false;
var cleanupRunning = false;
var scriptRunning = false;
var auctionEndingSoon = false;
var lastRunningMode = '';
var lastTimeAtkRan = 0;
var lastTimeQuestRan = 0;
var currentAtkIdx = -1;
var stuffOn = -2;
var selectedOuu;

var currentStuffLoadFailed = 0;
var currentPageLoadFailed = 0;
var MAX_STUFF_LOAD_FAIL = 10;
var MAX_PAGE_LOAD_FAIL = 10;

var lastExpeCheckTime = -1;
var lastSwrCheckTime = -1;
var lastArenaCheckTime = -1;
var lastDestuffDeconnectedCheckTime = -1;
var nextExpeTime = null;
var nextExpeLocations = [];
var nextSwrTime = null;
var lastTryToJoinExpeTime = -1;
var lastTryToJoinKothTime = -1;
var allExpeToJoin = [];
var allKothToJoin = [];
var canLaunchExpe = false;
var canLaunchKoth = false;

var lastAuctionCheckTime = -1;
var nextAuctionTime = null;

var questMessageSent = false;
var questMessageList = [];
var questMessageIdx = -1;
var questMessages = [
  ['Stuff chance pour [[NB_QUEST]] quête[[S_IF_PLURAL]]'],
  ['chance chez moi, [[NB_QUEST]] quete[[S_IF_PLURAL]]'],
  [ 'je prend la chance pour [[NB_QUEST]] quête[[S_IF_PLURAL]]',
    'de nouveau la chance chez moi, j\'ai [[NB_QUEST]] quête[[S_IF_PLURAL]]',
    'encore une fois, chance chez moi, [[NB_QUEST]] quête[[S_IF_PLURAL]]',
    '[[NB_QUEST]] quête[[S_IF_PLURAL]] à lancer, je reprend la chance',
    'encore moi ><, [[NB_QUEST]] quête[[S_IF_PLURAL]] à lancer'
  ]
];

//******************* User settings - Targets, stuff and arcanes *******************

//*** Special settings ***
var CLAN_ARMOURY_SHELF_UT1 = -1;
var CLAN_ARMOURY_SHELF_UT2 = 9;
var CLAN_ARMOURY_SHELF_UT3 = 9;
var CLAN_ARMOURY_SHELF_MORIA = -1;

var MY_ID_UT1 = -1;
var MY_ID_UT2 = -1;
var MY_ID_UT3 = -1;
var MY_ID_MORIA = -1;

var MY_CREDENTIALS_UT1 = {};
var MY_CREDENTIALS_UT2 = {};
var MY_CREDENTIALS_UT3 = {};
var MY_CREDENTIALS_MORIA = {};

//*** Auction ***
var JUNK_AUCTION_PRICE_UT1 = -1;
var JUNK_AUCTION_PRICE_UT2 = -1;
var JUNK_AUCTION_PRICE_UT3 = -1;
var JUNK_AUCTION_PRICE_MORIA = -1;

var ITEMS_TO_BUY_UT1 = [];
var ITEMS_TO_BUY_UT2 = [];
var ITEMS_TO_BUY_UT3 = [];
var ITEMS_TO_BUY_MORIA = [];

//*** EXPE ***
var DEFAULT_EXPE_STUFF_UT1 = -1;
var DEFAULT_EXPE_STUFF_UT2 = -1;
var DEFAULT_EXPE_STUFF_UT3 = -1;
var DEFAULT_EXPE_STUFF_MORIA = -1;

var EXPE_STUFF_FOR_LOCATION_UT1 = {};
var EXPE_STUFF_FOR_LOCATION_UT2 = {};
var EXPE_STUFF_FOR_LOCATION_UT3 = {};
var EXPE_STUFF_FOR_LOCATION_MORIA = {};

var DEFAULT_STUFF_TO_JOIN_EXPE_UT1 = -1;
var DEFAULT_STUFF_TO_JOIN_EXPE_UT2 = -1;
var DEFAULT_STUFF_TO_JOIN_EXPE_UT3 = -1;
var DEFAULT_STUFF_TO_JOIN_EXPE_MORIA = -1;

var EXPE_STUFF_TO_JOIN_LOCATION_UT1 = {};
var EXPE_STUFF_TO_JOIN_LOCATION_UT2 = {};
var EXPE_STUFF_TO_JOIN_LOCATION_UT3 = {};
var EXPE_STUFF_TO_JOIN_LOCATION_MORIA = {};

var DEFAULT_ARK_EVO_TO_JOIN_EXPO_UT1 = [];
var DEFAULT_ARK_EVO_TO_JOIN_EXPO_UT2 = [];
var DEFAULT_ARK_EVO_TO_JOIN_EXPO_UT3 = [];
var DEFAULT_ARK_EVO_TO_JOIN_EXPO_MORIA = [];

var EXPE_ARK_EVO_TO_JOIN_LOCATION_UT1 = {};
var EXPE_ARK_EVO_TO_JOIN_LOCATION_UT2 = {};
var EXPE_ARK_EVO_TO_JOIN_LOCATION_UT3 = {};
var EXPE_ARK_EVO_TO_JOIN_LOCATION_MORIA = {};

var OUU_TO_LAUNCH_EXPO_UT1 = 0;
var OUU_TO_LAUNCH_EXPO_UT2 = 0;
var OUU_TO_LAUNCH_EXPO_UT3 = 0;
var OUU_TO_LAUNCH_EXPO_MORIA = 0;

var NON_SAMA_EXPO_TO_JOIN_UT1 = {};
var NON_SAMA_EXPO_TO_JOIN_UT2 = {};
var NON_SAMA_EXPO_TO_JOIN_UT3 = {};
var NON_SAMA_EXPO_TO_JOIN_MORIA = {};

var EXPE_TO_LAUNCH_UT1 = {};
var EXPE_TO_LAUNCH_UT2 = {};
var EXPE_TO_LAUNCH_UT3 = {};
var EXPE_TO_LAUNCH_MORIA = {};

//*** RDC ***
var RDC_STUFF_UT1 = -1;
var RDC_STUFF_UT2 = -1;
var RDC_STUFF_UT3 = -1;
var RDC_STUFF_MORIA = -1;

var STUFF_TO_JOIN_RDC_UT1 = -1;
var STUFF_TO_JOIN_RDC_UT2 = -1;
var STUFF_TO_JOIN_RDC_UT3 = -1;
var STUFF_TO_JOIN_RDC_MORIA = -1;

var ARK_EVO_TO_JOIN_RDC_UT1 = [];
var ARK_EVO_TO_JOIN_RDC_UT2 = [];
var ARK_EVO_TO_JOIN_RDC_UT3 = [];
var ARK_EVO_TO_JOIN_RDC_MORIA = [];

var RDC_TO_LAUNCH_UT1 = {};
var RDC_TO_LAUNCH_UT2 = {};
var RDC_TO_LAUNCH_UT3 = {};
var RDC_TO_LAUNCH_MORIA = {};

//*** ARENA 1 VS 1 ***
var ARENA_1_V_1_STUFF_UT1 = -1;
var ARENA_1_V_1_STUFF_UT2 = -1;
var ARENA_1_V_1_STUFF_UT3 = -1;
var ARENA_1_V_1_STUFF_MORIA = -1;

var ARENA_1_V_1_ARK_EVO_UT1 = [];
var ARENA_1_V_1_ARK_EVO_UT2 = [];
var ARENA_1_V_1_ARK_EVO_UT3 = [];
var ARENA_1_V_1_ARK_EVO_MORIA = [];

var ARENA_1_V_1_OUU_UT1 = -1;
var ARENA_1_V_1_OUU_UT2 = -1;
var ARENA_1_V_1_OUU_UT3 = -1;
var ARENA_1_V_1_OUU_MORIA = -1;

//*** ARENA 3 VS 3 ***
var ARENA_3_V_3_STUFF_UT1 = -1;
var ARENA_3_V_3_STUFF_UT2 = -1;
var ARENA_3_V_3_STUFF_UT3 = -1;
var ARENA_3_V_3_STUFF_MORIA = -1;

var ARENA_3_V_3_TO_LAUNCH_UT1 = {};
var ARENA_3_V_3_TO_LAUNCH_UT2 = {};
var ARENA_3_V_3_TO_LAUNCH_UT3 = {};
var ARENA_3_V_3_TO_LAUNCH_MORIA = {};

var STUFF_TO_JOIN_3_V_3_ARENA_UT1 = -1;
var STUFF_TO_JOIN_3_V_3_ARENA_UT2 = -1;
var STUFF_TO_JOIN_3_V_3_ARENA_UT3 = -1;
var STUFF_TO_JOIN_3_V_3_ARENA_MORIA = -1;

var ARK_EVO_TO_JOIN_3_V_3_ARENA_UT1 = [];
var ARK_EVO_TO_JOIN_3_V_3_ARENA_UT2 = [];
var ARK_EVO_TO_JOIN_3_V_3_ARENA_UT3 = [];
var ARK_EVO_TO_JOIN_3_V_3_ARENA_MORIA = [];

var ARENA_3_V_3_OUU_UT1 = -1;
var ARENA_3_V_3_OUU_UT2 = -1;
var ARENA_3_V_3_OUU_UT3 = -1;
var ARENA_3_V_3_OUU_MORIA = -1;

//*** ARENA CLAN VS CLAN ***
var ARENA_CLAN_V_CLAN_STUFF_UT1 = -1;
var ARENA_CLAN_V_CLAN_STUFF_UT2 = -1;
var ARENA_CLAN_V_CLAN_STUFF_UT3 = -1;
var ARENA_CLAN_V_CLAN_STUFF_MORIA = -1;

var STUFF_TO_JOIN_CLAN_V_CLAN_ARENA_UT1 = -1;
var STUFF_TO_JOIN_CLAN_V_CLAN_ARENA_UT2 = -1;
var STUFF_TO_JOIN_CLAN_V_CLAN_ARENA_UT3 = -1;
var STUFF_TO_JOIN_CLAN_V_CLAN_ARENA_MORIA = -1;

var ARK_EVO_TO_JOIN_CLAN_V_CLAN_ARENA_UT1 = [];
var ARK_EVO_TO_JOIN_CLAN_V_CLAN_ARENA_UT2 = [];
var ARK_EVO_TO_JOIN_CLAN_V_CLAN_ARENA_UT3 = [];
var ARK_EVO_TO_JOIN_CLAN_V_CLAN_ARENA_MORIA = [];

var ARENA_CLAN_V_CLAN_OUU_UT1 = -1;
var ARENA_CLAN_V_CLAN_OUU_UT2 = -1;
var ARENA_CLAN_V_CLAN_OUU_UT3 = -1;
var ARENA_CLAN_V_CLAN_OUU_MORIA = -1;

//*** QUEST ***
var QUEST_STUFF_UT1 = -1;
var QUEST_STUFF_UT2 = -1;
var QUEST_STUFF_UT3 = -1;
var QUEST_STUFF_MORIA = -1;

var QUEST_ARK_EVO_UT1 = [];
var QUEST_ARK_EVO_UT2 = [];
var QUEST_ARK_EVO_UT3 = [];
var QUEST_ARK_EVO_MORIA = [];

//*** ATK ***
var RANDOMLY_SORT_TARGET_UT1 = false;
var RANDOMLY_SORT_TARGET_UT2 = false;
var RANDOMLY_SORT_TARGET_UT3 = false;
var RANDOMLY_SORT_TARGET_MORIA = false;

var AVAILABLE_ATK_TARGET_UT1 = [];
var AVAILABLE_ATK_TARGET_UT2 = [];
var AVAILABLE_ATK_TARGET_UT3 = [];
var AVAILABLE_ATK_TARGET_MORIA = [];

var DEFAULT_ATK_STUFF_UT1 = -1;
var DEFAULT_ATK_STUFF_UT2 = -1;
var DEFAULT_ATK_STUFF_UT3 = -1;
var DEFAULT_ATK_STUFF_MORIA = -1;

var DEFAULT_ATK_ARK_EVO_UT1 = [];
var DEFAULT_ATK_ARK_EVO_UT2 = [];
var DEFAULT_ATK_ARK_EVO_UT3 = [];
var DEFAULT_ATK_ARK_EVO_MORIA = [];

//*** DEF ***
var DEF_STUFF_UT1 = -1;
var DEF_STUFF_UT2 = -1;
var DEF_STUFF_UT3 = -1;
var DEF_STUFF_MORIA = -1;

//******************* Manage user settings - DO NOT TOUCH *******************

//*** Special settings ***
var CLAN_ARMOURY_SHELF_FOR_SERV = {
  1: CLAN_ARMOURY_SHELF_UT1,
  2: CLAN_ARMOURY_SHELF_UT2,
  3: CLAN_ARMOURY_SHELF_MORIA,
  4: CLAN_ARMOURY_SHELF_UT3
};

var CLAN_ARMOURY_SHELF = CLAN_ARMOURY_SHELF_FOR_SERV[SERV];

var MY_ID_FOR_SERV = {
  1: MY_ID_UT1,
  2: MY_ID_UT2,
  3: MY_ID_MORIA,
  4: MY_ID_UT3
};

var MY_ID = MY_ID_FOR_SERV[SERV];

var MY_CREDENTIALS_FOR_SERV = {
  1: MY_CREDENTIALS_UT1,
  2: MY_CREDENTIALS_UT2,
  3: MY_CREDENTIALS_MORIA,
  4: MY_CREDENTIALS_UT3
};

var MY_CREDENTIALS = MY_CREDENTIALS_FOR_SERV[SERV];

//*** Auction ***

var JUNK_AUCTION_PRICE_FOR_SERV = {
  1: JUNK_AUCTION_PRICE_UT1,
  2: JUNK_AUCTION_PRICE_UT2,
  3: JUNK_AUCTION_PRICE_MORIA,
  4: JUNK_AUCTION_PRICE_UT3
};
var ITEMS_TO_BUY_FOR_SERV = {
  1: ITEMS_TO_BUY_UT1,
  2: ITEMS_TO_BUY_UT2,
  3: ITEMS_TO_BUY_MORIA,
  4: ITEMS_TO_BUY_UT3
};


var JUNK_AUCTION_PRICE = JUNK_AUCTION_PRICE_FOR_SERV[SERV];
var ITEMS_TO_BUY = ITEMS_TO_BUY_FOR_SERV[SERV];


//*** EXPE ***
var DEFAULT_EXPE_STUFF_FOR_SERV = {
  1: DEFAULT_EXPE_STUFF_UT1,
  2: DEFAULT_EXPE_STUFF_UT2,
  3: DEFAULT_EXPE_STUFF_MORIA,
  4: DEFAULT_EXPE_STUFF_UT3
};
var EXPE_STUFF_FOR_LOCATION_FOR_SERV = {
  1: EXPE_STUFF_FOR_LOCATION_UT1,
  2: EXPE_STUFF_FOR_LOCATION_UT2,
  3: EXPE_STUFF_FOR_LOCATION_MORIA,
  4: EXPE_STUFF_FOR_LOCATION_UT3
};
var DEFAULT_STUFF_TO_JOIN_EXPE_SERV = {
  1: DEFAULT_STUFF_TO_JOIN_EXPE_UT1,
  2: DEFAULT_STUFF_TO_JOIN_EXPE_UT2,
  3: DEFAULT_STUFF_TO_JOIN_EXPE_MORIA,
  4: DEFAULT_STUFF_TO_JOIN_EXPE_UT3
};
var EXPE_STUFF_TO_JOIN_LOCATION_SERV = {
  1: EXPE_STUFF_TO_JOIN_LOCATION_UT1,
  2: EXPE_STUFF_TO_JOIN_LOCATION_UT2,
  3: EXPE_STUFF_TO_JOIN_LOCATION_MORIA,
  4: EXPE_STUFF_TO_JOIN_LOCATION_UT3
};
var DEFAULT_ARK_EVO_TO_JOIN_EXPO_SERV = {
  1: DEFAULT_ARK_EVO_TO_JOIN_EXPO_UT1,
  2: DEFAULT_ARK_EVO_TO_JOIN_EXPO_UT2,
  3: DEFAULT_ARK_EVO_TO_JOIN_EXPO_MORIA,
  4: DEFAULT_ARK_EVO_TO_JOIN_EXPO_UT3
};
var EXPE_ARK_EVO_TO_JOIN_LOCATION_SERV = {
  1: EXPE_ARK_EVO_TO_JOIN_LOCATION_UT1,
  2: EXPE_ARK_EVO_TO_JOIN_LOCATION_UT2,
  3: EXPE_ARK_EVO_TO_JOIN_LOCATION_MORIA,
  4: EXPE_ARK_EVO_TO_JOIN_LOCATION_UT3
};
var OUU_TO_LAUNCH_EXPO_SERV = {
  1: OUU_TO_LAUNCH_EXPO_UT1,
  2: OUU_TO_LAUNCH_EXPO_UT2,
  3: OUU_TO_LAUNCH_EXPO_MORIA,
  4: OUU_TO_LAUNCH_EXPO_UT3
};
var NON_SAMA_EXPO_TO_JOIN_SERV = {
  1: NON_SAMA_EXPO_TO_JOIN_UT1,
  2: NON_SAMA_EXPO_TO_JOIN_UT2,
  3: NON_SAMA_EXPO_TO_JOIN_MORIA,
  4: NON_SAMA_EXPO_TO_JOIN_UT3
};
var EXPE_TO_LAUNCH_SERV = {
  1: EXPE_TO_LAUNCH_UT1,
  2: EXPE_TO_LAUNCH_UT2,
  3: EXPE_TO_LAUNCH_MORIA,
  4: EXPE_TO_LAUNCH_UT3
};

var DEFAULT_EXPE_STUFF = DEFAULT_EXPE_STUFF_FOR_SERV[SERV];
var EXPE_STUFF_FOR_LOCATION = EXPE_STUFF_FOR_LOCATION_FOR_SERV[SERV];
var DEFAULT_STUFF_TO_JOIN_EXPE = DEFAULT_STUFF_TO_JOIN_EXPE_SERV[SERV];
var EXPE_STUFF_TO_JOIN_LOCATION = EXPE_STUFF_TO_JOIN_LOCATION_SERV[SERV];
var DEFAULT_ARK_EVO_TO_JOIN_EXPO = DEFAULT_ARK_EVO_TO_JOIN_EXPO_SERV[SERV];
var EXPE_ARK_EVO_TO_JOIN_LOCATION = EXPE_ARK_EVO_TO_JOIN_LOCATION_SERV[SERV];
var OUU_TO_LAUNCH_EXPO = OUU_TO_LAUNCH_EXPO_SERV[SERV];
var NON_SAMA_EXPO_TO_JOIN = NON_SAMA_EXPO_TO_JOIN_SERV[SERV];
var EXPE_TO_LAUNCH = EXPE_TO_LAUNCH_SERV[SERV];
EXPE_TO_LAUNCH.eventJoinPageUrl = EXPE_JOIN_PAGE_URL;
EXPE_TO_LAUNCH.eventClosePageUrl = EXPE_CLOSE_PAGE_URL;
EXPE_TO_LAUNCH.eventUpdateDescUrl = EXPE_UPDATE_DESC_URL;
EXPE_TO_LAUNCH.actionType = 'cevent';

//*** RDC ***
var RDC_STUFF_FOR_SERV = {
  1: RDC_STUFF_UT1,
  2: RDC_STUFF_UT2,
  3: RDC_STUFF_MORIA,
  4: RDC_STUFF_UT3
};
var STUFF_TO_JOIN_RDC_FOR_SERV = {
  1: STUFF_TO_JOIN_RDC_UT1,
  2: STUFF_TO_JOIN_RDC_UT2,
  3: STUFF_TO_JOIN_RDC_MORIA,
  4: STUFF_TO_JOIN_RDC_UT3
};
var ARK_EVO_TO_JOIN_RDC_FOR_SERV = {
  1: ARK_EVO_TO_JOIN_RDC_UT1,
  2: ARK_EVO_TO_JOIN_RDC_UT2,
  3: ARK_EVO_TO_JOIN_RDC_MORIA,
  4: ARK_EVO_TO_JOIN_RDC_UT3
};
var RDC_TO_LAUNCH_FOR_SERV = {
  1: RDC_TO_LAUNCH_UT1,
  2: RDC_TO_LAUNCH_UT2,
  3: RDC_TO_LAUNCH_MORIA,
  4: RDC_TO_LAUNCH_UT3
};

var RDC_STUFF = RDC_STUFF_FOR_SERV[SERV];
var STUFF_TO_JOIN_RDC = STUFF_TO_JOIN_RDC_FOR_SERV[SERV];
var ARK_EVO_TO_JOIN_RDC = ARK_EVO_TO_JOIN_RDC_FOR_SERV[SERV];
var RDC_TO_LAUNCH = RDC_TO_LAUNCH_FOR_SERV[SERV];
RDC_TO_LAUNCH.eventJoinPageUrl = SWR_JOIN_PAGE_URL;
RDC_TO_LAUNCH.eventClosePageUrl = SWR_CLOSE_PAGE_URL;
RDC_TO_LAUNCH.eventUpdateDescUrl = SWR_UPDATE_DESC_URL;
RDC_TO_LAUNCH.actionType = 'swr';

//*** ARENA 1 VS 1 ***
var ARENA_1_V_1_STUFF_FOR_SERV = {
  1: ARENA_1_V_1_STUFF_UT1,
  2: ARENA_1_V_1_STUFF_UT2,
  3: ARENA_1_V_1_STUFF_MORIA,
  4: ARENA_1_V_1_STUFF_UT3
};
var ARENA_1_V_1_ARK_EVO_FOR_SERV = {
  1: ARENA_1_V_1_ARK_EVO_UT1,
  2: ARENA_1_V_1_ARK_EVO_UT2,
  3: ARENA_1_V_1_ARK_EVO_MORIA,
  4: ARENA_1_V_1_ARK_EVO_UT3
};
var ARENA_1_V_1_OUU_FOR_SERV = {
  1: ARENA_1_V_1_OUU_UT1,
  2: ARENA_1_V_1_OUU_UT2,
  3: ARENA_1_V_1_OUU_MORIA,
  4: ARENA_1_V_1_OUU_UT3
};

var ARENA_1_V_1_STUFF = ARENA_1_V_1_STUFF_FOR_SERV[SERV];
var ARENA_1_V_1_ARK_EVO = ARENA_1_V_1_ARK_EVO_FOR_SERV[SERV];
var ARENA_1_V_1_OUU = ARENA_1_V_1_OUU_FOR_SERV[SERV];

//*** ARENA 3 VS 3 ***
var ARENA_3_V_3_STUFF_FOR_SERV = {
  1: ARENA_3_V_3_STUFF_UT1,
  2: ARENA_3_V_3_STUFF_UT2,
  3: ARENA_3_V_3_STUFF_MORIA,
  4: ARENA_3_V_3_STUFF_UT3
};
var ARENA_3_V_3_TO_LAUNCH_FOR_SERV = {
  1: ARENA_3_V_3_TO_LAUNCH_UT1,
  2: ARENA_3_V_3_TO_LAUNCH_UT2,
  3: ARENA_3_V_3_TO_LAUNCH_MORIA,
  4: ARENA_3_V_3_TO_LAUNCH_UT3
};
var STUFF_TO_JOIN_3_V_3_ARENA_FOR_SERV = {
  1: STUFF_TO_JOIN_3_V_3_ARENA_UT1,
  2: STUFF_TO_JOIN_3_V_3_ARENA_UT2,
  3: STUFF_TO_JOIN_3_V_3_ARENA_MORIA,
  4: STUFF_TO_JOIN_3_V_3_ARENA_UT3
};
var ARK_EVO_TO_JOIN_3_V_3_ARENA_FOR_SERV = {
  1: ARK_EVO_TO_JOIN_3_V_3_ARENA_UT1,
  2: ARK_EVO_TO_JOIN_3_V_3_ARENA_UT2,
  3: ARK_EVO_TO_JOIN_3_V_3_ARENA_MORIA,
  4: ARK_EVO_TO_JOIN_3_V_3_ARENA_UT3
};
var ARENA_3_V_3_OUU_FOR_SERV = {
  1: ARENA_3_V_3_OUU_UT1,
  2: ARENA_3_V_3_OUU_UT2,
  3: ARENA_3_V_3_OUU_MORIA,
  4: ARENA_3_V_3_OUU_UT3
};

var ARENA_3_V_3_STUFF = ARENA_3_V_3_STUFF_FOR_SERV[SERV];
var ARENA_3_V_3_TO_LAUNCH = ARENA_3_V_3_TO_LAUNCH_FOR_SERV[SERV];
var STUFF_TO_JOIN_3_V_3_ARENA = STUFF_TO_JOIN_3_V_3_ARENA_FOR_SERV[SERV];
var ARK_EVO_TO_JOIN_3_V_3_ARENA = ARK_EVO_TO_JOIN_3_V_3_ARENA_FOR_SERV[SERV];
var ARENA_3_V_3_OUU = ARENA_3_V_3_OUU_FOR_SERV[SERV];
ARENA_3_V_3_TO_LAUNCH.eventJoinPageUrl = ARENA_3_V_3_JOIN_PAGE_URL;
ARENA_3_V_3_TO_LAUNCH.eventClosePageUrl = ARENA_3_V_3_CLOSE_PAGE_URL;
ARENA_3_V_3_TO_LAUNCH.eventUpdateDescUrl = ARENA_3_V_3_UPDATE_DESC_URL;
ARENA_3_V_3_TO_LAUNCH.actionType = 'newarena_team';

//*** ARENA CLAN VS CLAN ***
var ARENA_CLAN_V_CLAN_STUFF_FOR_SERV = {
  1: ARENA_CLAN_V_CLAN_STUFF_UT1,
  2: ARENA_CLAN_V_CLAN_STUFF_UT2,
  3: ARENA_CLAN_V_CLAN_STUFF_MORIA,
  4: ARENA_CLAN_V_CLAN_STUFF_UT3
};
var ARK_EVO_TO_JOIN_CLAN_V_CLAN_ARENA_FOR_SERV = {
  1: ARK_EVO_TO_JOIN_CLAN_V_CLAN_ARENA_UT1,
  2: ARK_EVO_TO_JOIN_CLAN_V_CLAN_ARENA_UT2,
  3: ARK_EVO_TO_JOIN_CLAN_V_CLAN_ARENA_MORIA,
  4: ARK_EVO_TO_JOIN_CLAN_V_CLAN_ARENA_UT3
};
var STUFF_TO_JOIN_CLAN_V_CLAN_ARENA_FOR_SERV = {
  1: STUFF_TO_JOIN_CLAN_V_CLAN_ARENA_UT1,
  2: STUFF_TO_JOIN_CLAN_V_CLAN_ARENA_UT2,
  3: STUFF_TO_JOIN_CLAN_V_CLAN_ARENA_MORIA,
  4: STUFF_TO_JOIN_CLAN_V_CLAN_ARENA_UT3
};
var ARENA_CLAN_V_CLAN_OUU_FOR_SERV = {
  1: ARENA_CLAN_V_CLAN_OUU_UT1,
  2: ARENA_CLAN_V_CLAN_OUU_UT2,
  3: ARENA_CLAN_V_CLAN_OUU_MORIA,
  4: ARENA_CLAN_V_CLAN_OUU_UT3
};

var ARENA_CLAN_V_CLAN_STUFF = ARENA_CLAN_V_CLAN_STUFF_FOR_SERV[SERV];
var ARK_EVO_TO_JOIN_CLAN_V_CLAN_ARENA = ARK_EVO_TO_JOIN_CLAN_V_CLAN_ARENA_FOR_SERV[SERV];
var STUFF_TO_JOIN_CLAN_V_CLAN_ARENA = STUFF_TO_JOIN_CLAN_V_CLAN_ARENA_FOR_SERV[SERV];
var ARENA_CLAN_V_CLAN_OUU = ARENA_CLAN_V_CLAN_OUU_FOR_SERV[SERV];

//*** QUEST ***
var QUEST_STUFF_FOR_SERV = {
  1: QUEST_STUFF_UT1,
  2: QUEST_STUFF_UT2,
  3: QUEST_STUFF_MORIA,
  4: QUEST_STUFF_UT3
};
var QUEST_ARK_EVO_FOR_SERV = {
  1: QUEST_ARK_EVO_UT1,
  2: QUEST_ARK_EVO_UT2,
  3: QUEST_ARK_EVO_MORIA,
  4: QUEST_ARK_EVO_UT3
};

var QUEST_STUFF = QUEST_STUFF_FOR_SERV[SERV];
var QUEST_ARK_EVO = QUEST_ARK_EVO_FOR_SERV[SERV];

//*** ATK ***
var RANDOMLY_SORT_TARGET_FOR_SERV = {
  1: RANDOMLY_SORT_TARGET_UT1,
  2: RANDOMLY_SORT_TARGET_UT2,
  3: RANDOMLY_SORT_TARGET_MORIA,
  4: RANDOMLY_SORT_TARGET_UT3
};
var RANDOMLY_SORT_TARGET = RANDOMLY_SORT_TARGET_FOR_SERV[SERV];

var AVAILABLE_ATK_ARK_TARGET_FOR_SERV = {
  1: AVAILABLE_ATK_TARGET_UT1,
  2: AVAILABLE_ATK_TARGET_UT2,
  3: AVAILABLE_ATK_TARGET_MORIA,
  4: AVAILABLE_ATK_TARGET_UT3
};
var DEFAULT_ATK_STUFF_FOR_SERV = {
  1: DEFAULT_ATK_STUFF_UT1,
  2: DEFAULT_ATK_STUFF_UT2,
  3: DEFAULT_ATK_STUFF_MORIA,
  4: DEFAULT_ATK_STUFF_UT3
};
var DEFAULT_ATK_ARK_EVO_FOR_SERV = {
  1: DEFAULT_ATK_ARK_EVO_UT1,
  2: DEFAULT_ATK_ARK_EVO_UT2,
  3: DEFAULT_ATK_ARK_EVO_MORIA,
  4: DEFAULT_ATK_ARK_EVO_UT3
};

var AVAILABLE_ATK_TARGET = AVAILABLE_ATK_ARK_TARGET_FOR_SERV[SERV];
if(RANDOMLY_SORT_TARGET) {
  var unsortedList = AVAILABLE_ATK_TARGET.slice();
  var sortedList = [];
  while(unsortedList.length > 0) {
    sortedList.push(unsortedList.splice(Math.floor(Math.random()*unsortedList.length), 1)[0]);
  }

  AVAILABLE_ATK_TARGET = sortedList;
}

var DEFAULT_ATK_STUFF = DEFAULT_ATK_STUFF_FOR_SERV[SERV];
var DEFAULT_ATK_ARK_EVO = DEFAULT_ATK_ARK_EVO_FOR_SERV[SERV];

//*** DEF ***
var DEF_STUFF_FOR_SERV = {
  1: DEF_STUFF_UT1,
  2: DEF_STUFF_UT2,
  3: DEF_STUFF_MORIA,
  4: DEF_STUFF_UT3
};

var DEF_STUFF = DEF_STUFF_FOR_SERV[SERV];

//******************* Utils - DO NOT TOUCH *******************

var arkEvoFor = function(arkEvoList) {
  var res = '';

  for(var i = 0; i < arkEvoList.length; ++i) {
    var arkEvo = arkEvoList[i];

    if(arkEvo.name in ARK_MAP) {
      res += '&ark%5B' + ARK_MAP[arkEvo.name] + '%5D=' + arkEvo.value;
    } else {
      res += '&evo%5B' + EVO_MAP[arkEvo.name] + '%5D=' + arkEvo.value;
    }
  }

  return res;
};

var cleanup = function(page) {
  if(!cleanupRunning) {
    cleanupRunning = true;

    updateMessage('Préparation pour le changement de mode');
  }

  if(typeof page === 'undefined') {
    loadPage('POST', ARMOURY_PAGE_URL, '', cleanup);
    return;
  }
  var source = getSource(page);

  if(stuffOn !== DEF_STUFF) {
    updateStuff(cleanup, DEF_STUFF);
    return;
  }

  getBorrowedCaItem().then(function(borrowedCaItem) {
    if(borrowedCaItem.length > 0) {
      returnBorrowedCaItem(cleanup, source);
      return;
    }

    cleanupRunning = false;
    updateMessage('Prêt à changer de mode');
    updateMode();
    return;
  });
};

var completeAllExpeToJoin = function(expePage, allEventToJoin) {
  for(var i = 0; i < allEventToJoin.length; ++i) {
    var expeInfo = allEventToJoin[i];

    var startRegex = 'uid=(\\d+)"(?:.*?\\r?\\n)(?:.*?\\r?\\n)(?:.*?\\r?\\n)(?:.*?)onmouseout="nd\\(\\);">(?!\\S)';
    var readLocation = '(?:(?:(?!expDesc_).)*?\\r?\\n)+?(.*?)<\\/td>';
    var readNumberOfPlayer = '(?:(?:(?!expDesc_).)*?\\r?\\n)+?.*onmouseout="nd\\(\\);"><b>(\\d+).*?</b>';
    var readDescription = '(?:(?:(?!expDesc_).)*?\\r?\\n)+?.*?<span id="expDesc_' + expeInfo.id + '".*?>(.*?)<\\/span>';
    var re = new RegExp(startRegex + readLocation + readNumberOfPlayer + readDescription);

    var expeInfoRead = re.exec(expePage);
    if(expeInfoRead === null) {
      allEventToJoin.splice(i--, 1);
      continue;
    }

    var launcherId = expeInfoRead[1] | 0;
    var location = expeInfoRead[2].trim().replace(" (La Chasse)", "");
    var numberOfPlayer = expeInfoRead[3] | 0;
    var maxNumberOfPlayer = null;
    var description = expeInfoRead[4].replace(/&.*?;/g, '').replace(/\d+\s*h(?:\s*\d+)?/g, '');
    var numberRegex = /\d+/g;
    var maxTry = 10;
    while ((regexpResult = numberRegex.exec(description)) !== null && maxTry-- > 0) {
      var number = regexpResult[0] | 0;
      if(maxNumberOfPlayer === null || number > maxNumberOfPlayer) {
        maxNumberOfPlayer = number;
      }
      if(maxTry === 0) {
        updateMessage('Il y a eu un problème pour lire la description d\'expédition: ' + description);
        maxNumberOfPlayer = numberOfPlayer;
      }
    }

    expeInfo.launcherId = launcherId;
    expeInfo.location = location;
    expeInfo.numberOfPlayer = numberOfPlayer;
    expeInfo.maxNumberOfPlayer = maxNumberOfPlayer;
    expeInfo.isCut = false;
  }
};

var getBorrowedCaItem = function() {
  var firstItemsPromise = syncXmlRequest({
    method: "GET",
    url: ARMOURY_ITEMS_FIRST_PAGE_URL
  });
  var nextItemsPromise = syncXmlRequest({
    method: "GET",
    url: ARMOURY_ITEMS_SECOND_PAGE_URL
  });

  return Promise.all([firstItemsPromise, nextItemsPromise]).then(function(responses) {
    var firstItems = JSON.parse(responses[0].response).data;
    var nextItems = JSON.parse(responses[1].response).data;

    var clanArmouryKey = " 20";
    var personalClanArmouryShelfKey = " " + (CLAN_ARMOURY_SHELF - 1);

    var itemsHtml = '';

    if(firstItems.itemCount > 0) {
      itemsHtml += firstItems.itemTabHtml[clanArmouryKey] || '';
      itemsHtml += firstItems.itemTabHtml[personalClanArmouryShelfKey] || '';
    }

    if(nextItems.itemCount > 0) {
      itemsHtml += nextItems.itemTabHtml[clanArmouryKey] || '';
      itemsHtml += nextItems.itemTabHtml[personalClanArmouryShelfKey] || '';
    }

    var borrowedCaItem = [];
    var re = /itemid\[(\d+)\]/g;
    var itemId;
    while(itemId = re.exec(itemsHtml)) {
      borrowedCaItem.push(itemId[1]);
    }

    return borrowedCaItem;
  });
};

var getCurrentLol = function(page) {
  return parseInt(/<b>Argent<\/b>\s+<br\/>(?:<.*?>)?(.*?)LOL/.exec(page.responseText)[1].replace(/\s+/g,''), DECIMAL_BASE);
};

var getCurrentTimeInS = function(source) {
  var time = /<div id="servertime">(\d{1,2}):(\d{2}):(\d{2})<\/div>/.exec(source);

  if(time !== null) {
    return time[1] * HOUR_IN_S + time[2] * MINUTE_IN_S + parseInt(time[3], DECIMAL_BASE);
  } else {
    var debugInfo = /<div id="servertime">.*?<\/div>/.exec(source);
    updateMessage('Impossible de lire l\'heure actuel du server' + (debugInfo === null ? '' : ', string lu: ' + debugInfo[0]));
    return null;
  }
};

var getExpeStuff = function() {
  var expeStuff = null;
  for(var location of nextExpeLocations) {
    if(EXPE_STUFF_FOR_LOCATION.hasOwnProperty(location)) {
      var tmpExpeStuff = EXPE_STUFF_FOR_LOCATION[location];

      if(expeStuff === null || location === EXPE_TO_LAUNCH.location) {
        expeStuff = tmpExpeStuff;
      }
    }
  }

  return expeStuff === null ? DEFAULT_EXPE_STUFF : expeStuff;
};

var getMyPseudoFromSource = function(source) {
  var pseudoFound = /<a class="me" href="\?a=profile">(.*?)<\/a>/.exec(source);
  if(pseudoFound !== null) {
    return pseudoFound[1];
  } else {
    return null;
  }
};

var getNextQuestMessage = function(nbQuest) {
  ++questMessageIdx;
  if(questMessageList.length <= questMessageIdx) {
    questMessageList = questMessages[parseInt(Math.random() * questMessages.length, 10)];
    questMessageIdx = 0;
  }

  var msg = questMessageList[questMessageIdx];
  return msg.replace('[[NB_QUEST]]', nbQuest).replace('[[S_IF_PLURAL]]', nbQuest !== 1 ? 's' : '');
};

var getRandomTimeoutTimer = function(minTime) {
  minTime = minTime || 5;
  return (minTime + Math.floor(Math.random()*10)) * MARGIN_COEF;
};

var getSource = function(page, doNotCheckForAccessKey) {
  var response = page.responseText;
  if(!doNotCheckForAccessKey) {
    var currentAccessKeyRes = /var accessKey = '(.*\\?)'/.exec(response);

    if(currentAccessKeyRes !== null) {
      currentAccessKey = currentAccessKeyRes[1];
    } else {
      updateMessage('Couldn\'t retrieve the accesskey from page: ', 1);
      updateMessage(response, 1);
    }
  }

  return response;
};

var hasAccessKey = function(page) {
    return /var accessKey = '(.*\\?)'/.exec(page.responseText) !== null;
};

var isAuthorizedToLaunch = function(eventTolaunch) {
  var [minHours, minMinutes, minSeconds] = eventTolaunch.minLaunchTime.split(':').map(Number);
  var now = new Date();
  var currentHours = now.getHours();
  var currentMinutes = now.getMinutes();
  var currentSeconds = now.getSeconds();

  var minComputed = minHours * 3600 + minMinutes * 60 + minSeconds;
  var currentComputed = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

  return currentComputed >= minComputed; // It's later than the minimum date
};

var loadingPage = false;
var loadPage = function(method, url, data, onLoad) {
  var now = new Date();
  var currentDay = now.getDay();
  var currentHours = now.getHours();
  var currentMinutes = now.getMinutes();
  var currentSeconds = now.getSeconds();
  var expoResult = (currentMinutes === 59 && currentSeconds > 50) || (currentMinutes === 0 && currentSeconds < 30) || (currentMinutes === 29 && currentSeconds > 50) || (currentMinutes === 30 && currentSeconds < 30);
  var swrResults = (currentMinutes === 4 && currentSeconds > 50) || (currentMinutes === 5 && currentSeconds < 30) || (currentMinutes === 34 && currentSeconds > 50) || (currentMinutes === 35 && currentSeconds < 30);
  var dailyUpdate = (currentHours === 3 && currentMinutes === 59) || (currentHours === 4 && currentMinutes < 25);
  var arenaResults = (currentDay === 0 || currentDay === 1 || currentDay === 4) && currentHours === 21 && ((currentMinutes > 19 && currentMinutes < 23) || (currentMinutes > 49 && currentMinutes < 53));
  if(expoResult || swrResults || dailyUpdate || arenaResults) {
    if(!loadingPage) {
      updateMessage('Une maj du jeu est peut-être en cours, mise en pause');
      loadingPage = true;
    }
    setTimeout(loadPage.bind(null, method, url, data, onLoad), getRandomTimeoutTimer(1));
    return;
  } else {
    if(loadingPage) {
      updateMessage('Reprise du script');
      loadingPage = false;
    }
    setTimeout(function() {
      GM.xmlHttpRequest({
        method: method,
        url: url,
        data: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: _loadPageVerification.bind(null, method, url, data, onLoad)
      });
    }, MIN_TEMPO);
    return;
  }
};

var _loadPageVerification = function(method, url, data, onLoad, loadedPage) {
  var source = getSource(loadedPage, 1);
  var deconnected = /Vous avez été déconnecté en raison d`une longue inactivité/.exec(source) !== null || /Déconnexion par le système du jeu/.exec(source) !== null;
  //var failedToLoadThePage = /Une courte pause est en/.exec(getSource(loadedPage, 1)) !== null;
  var failedToLoadThePage = loadedPage.status !== 200 || /Une(?: courte)? pause est en/.exec(source) !== null || /Une pause en raison de conservation est en court/.exec(source) !== null;
  //Vous êtes prié(e) de ressayer dans quelques instants. -> 07:00:00
  //var failedToLoadThePage = !hasAccessKey(loadedPage);

  if(deconnected) {
    updateMessage('Le compte a été déconnecté');
    var connectionData = 'login=' + MY_CREDENTIALS.login + '&password=' + MY_CREDENTIALS.password + '&realm=' + MY_CREDENTIALS.realm + '&submit=CONNEXION&login_flag=2';
    setTimeout(loadPage.bind(null, 'POST', CONNECTION_PAGE_URL, connectionData, loadPage.bind(null, method, url, data, onLoad)), getRandomTimeoutTimer(1800));
    return;
  } else if(failedToLoadThePage/* && ++currentPageLoadFailed < MAX_PAGE_LOAD_FAIL*/) {
    updateMessage('Une maj du jeu est en cours');
    updateMessage(getSource(loadedPage, 1), 1);
    setTimeout(loadPage.bind(null, method, url, data, onLoad), getRandomTimeoutTimer(5));
    return;
  /*} else if (failedToLoadThePage) {
    updateMessage('Chargement de la page impossible');
    resetCurrentPageLoadFail();
    updateMode();
    return;
  */} else {
    resetCurrentPageLoadFail();
    onLoad(loadedPage, url);
    return;
  }
};

var loadNextEventInfos = function(eventPage, url) {
  var now = new Date();
  updateMessage('entering loadNextEventInfos', true);
  var eventName = /a=(.*)/.exec(url)[1];
  updateMessage(eventName, true);
  var source = getSource(eventPage);
  var currentTime = getCurrentTimeInS(source);

  var minTimeLeft = null;
  var minTimeLeftExpeLocations = null;

  var eventBug = /Il semblerait que l`expédition ne s`est pas terminée en temps voulu/.exec(source);
  if(eventBug !== null) {
    var h = now.getHours();
    var m;
    var s = now.getSeconds();
    if(eventName === 'cevent') {
      m = now.getMinutes() < 30 ? 30 : 60;
    } else if(eventName === 'swr') {
      m = now.getMinutes() < 5 ? 5 : now.getMinutes() < 35 ? 35 : 65;
    }
    var time = h * HOUR_IN_S + m * MINUTE_IN_S + s;
    minTimeLeft = time - currentTime;
    if(minTimeLeft < 0) {
      minTimeLeft += DAY_IN_S;
    }
  }

  var events = source.match(/<tr align="center"(.*\r?\n)+?.*<span id="expDesc.*?span>/g);
  for(var i = 0; events !== null && i < events.length; ++i) {
    var event = events[i];
    if(/Tu prends part à cette expédition/.exec(event) !== null || /Tu es le fondateur de cette expédition/.exec(event) !== null) {
      var timeLeft;

      var timeArray = /<div class="itemstacked1">\s*\d{4}-\d{2}-\d{2}\s(\d{2}):(\d{2}):(\d{2})/.exec(event); // Phase 1 of the event
      var timeLeftArray = /<div id="evTime_\d+">\s*(\d+):(\d+):(\d+)/.exec(event); // Phase 2 of the event
      var eventFinishedButNotYetComputed = /Terminé/.exec(event);
      if(timeArray !== null) {
        var eventEndTime = timeArrayInS(parseInt(timeArray[1], DECIMAL_BASE), parseInt(timeArray[2], DECIMAL_BASE), parseInt(timeArray[3], DECIMAL_BASE));
        timeLeft = eventEndTime - currentTime;
        if(timeLeft < 0) {
          timeLeft += DAY_IN_S;
        }
      } else if(timeLeftArray !== null) {
        timeLeft = timeArrayInS(parseInt(timeLeftArray[1], DECIMAL_BASE), parseInt(timeLeftArray[2], DECIMAL_BASE), parseInt(timeLeftArray[3], DECIMAL_BASE));
      } else if(eventFinishedButNotYetComputed !== null) {
        timeLeft = MINUTE_IN_S;
      } else {
        updateMessage('Une erreur est survenue en lisant un évènement.');
        console.log('Une erreur est survenue en lisant un évènement :');
        console.log(event);
        continue;
      }

      if(minTimeLeft === null || timeLeft < minTimeLeft) {
        minTimeLeft = timeLeft;
        minTimeLeftExpeLocations = [];
      }

      if(minTimeLeft === timeLeft) {
        var locationNameRegexpRes = /onmouseout="nd\(\);">(?:.*?\r?\n)+?(.*?)<\/td>/.exec(event);
        if(locationNameRegexpRes !== null) {
          var locationName = locationNameRegexpRes[1].trim().replace(" (La Chasse)", "");
          minTimeLeftExpeLocations.push(locationName);
        }
      }
    }
  }

  if(minTimeLeft === null) {
    if(eventName === 'cevent') {
      nextExpeTime = null;
      updateMessage('Aucune expédition rejointe');
    } else if(eventName === 'swr') {
      nextSwrTime = null;
      updateMessage('Aucun rdc rejoint');
    }
  } else {
    var nextEventTime = new Date();
    nextEventTime.setSeconds(nextEventTime.getSeconds() + minTimeLeft);
    if(eventName === 'cevent') {
      nextExpeTime = nextEventTime;
      nextExpeLocations = minTimeLeftExpeLocations;
      updateMessage('Prochaine expédition dans ' + parseDateFromSeconds(minTimeLeft));
    } else if(eventName === 'swr') {
      nextSwrTime = nextEventTime;
      updateMessage('Prochain rdc dans ' + parseDateFromSeconds(minTimeLeft));
    }
  }

  // Look for events to join
  var allEventsToJoinToJoin = source.match(/<label for=".*?">JOINDRE<\/label>/g);
  var allEventsToJoin = [];
  if(allEventsToJoinToJoin !== null) {
    for(var eventToJoin of allEventsToJoinToJoin) {
      allEventsToJoin.push({
        id: /(\d+)/.exec(eventToJoin)[1]
      });
    }
  }

  if(eventName === 'cevent') {
    allExpeToJoin = allEventsToJoin;
    canLaunchExpe = />La possibilité de lancer la prochaine expédition: <b>MAINTENANT<\/b>/.exec(source) !== null;
  } else if(eventName === 'swr') {
    allKothToJoin = allEventsToJoin;
    canLaunchKoth = />Possibilité de commencer une nouvelle expédition Roi de la Colline: <b>MAINTENANT<\/b>/.exec(source) !== null;
  }

  updateMode();
  return;
};

var parseDate = function(date) {
  return (date.getHours() > 9 ? '' : '0') + date.getHours() + ':' + (date.getMinutes() > 9 ? '' : '0') + date.getMinutes() + ':' + (date.getSeconds() > 9 ? '' : '0') + date.getSeconds();
};

var parseDateFromSeconds = function(totSeconds) {
  var seconds = totSeconds;
  var hours = parseInt(seconds / HOUR_IN_S, DECIMAL_BASE);
  seconds -= hours * HOUR_IN_S;
  var minutes = parseInt(seconds / MINUTE_IN_S, DECIMAL_BASE);
  seconds -= minutes * MINUTE_IN_S;

  if(hours > 0) {
    return hours + 'h ' + (minutes > 9 ? '' : '0') + minutes + 'm ' + (seconds > 9 ? '' : '0') + seconds + 's';
  } else if(minutes > 0) {
    return minutes + 'm ' + (seconds > 9 ? '' : '0') + seconds + 's';
  } else {
    return seconds + 's';
  }
};

var sellJunks = function(callback, count) {
  count = typeof count !== 'undefined' && count > 0 ? count : Math.ceil(MIN_LOL / JUNK_PRICE);
  updateMessage('Vente de ' + count + ' ferraille(s)');
  loadPage('POST', TOWNSHOP_PAGE_URL + '&selljunk=' + count + '&akey=' + currentAccessKey, '', callback);
  return;
};

var reloadUpdateModeLater = function(page, timer) {
  if(timer) {
    setTimeout(updateMode.bind(null, page), timer);
    return;
  } else {
    setTimeout(updateMode.bind(null, page), getRandomTimeoutTimer(5));
    return;
  }
  
};

var resetCurrentPageLoadFail = function() {
  currentPageLoadFailed = 0;
};

var resetCurrentStuffLoadFail = function() {
  currentStuffLoadFailed = 0;
};

var returnBorrowedCaItem = function(callback, source) {
  getBorrowedCaItem().then(function(borrowedCaItem) {
    if(borrowedCaItem.length > 0) {
      var returnBorrowedCaItemParam = '';

      for(var itemId of borrowedCaItem) {
        returnBorrowedCaItemParam += '&itemid%5B' + itemId + '%5D=on';
      }

      updateMessage('Remise en ac des items empruntés');
      loadPage('POST', ARMOURY_PAGE_URL, 'newTab=10&armoryPutIn=%C3%80+L%60ARMURERIE+DU+CLAN' + returnBorrowedCaItemParam, callback);
      return;
    } else {
      callback();
      return;
    }
  });
};

var sendShoutboxMessage = function(type, msg) {
  updateMessage('enter sendShoutboxMessage');
  var url = BASE_URL + '/_ajaxSbox.php?do=postNew&type=' + type + '&msg=' + msg;
  updateMessage(url);
  loadPage('POST', url, null, null);
  return;
};

var timeArrayInS = function(hours, minutes, seconds) {
  return hours * HOUR_IN_S + minutes * MINUTE_IN_S + seconds;
};

var updateStuff = function(callback, stuffIdx, page) {
  if(typeof page !== 'undefined') {
    getSource(page);
  }

  stuffOn = stuffIdx;
  updateMessage('Equipement du stuff #' + stuffIdx);
  loadPage('POST', ARMOURY_PAGE_URL + '&eqset= ' + stuffIdx + '&akey=' + currentAccessKey, '', _updateStuffVerification.bind(null, callback));
  return;
};

var _updateStuffVerification = function(callback, page) {
  var source = getSource(page);

  if(/On a équipé l`ensemble/.exec(source) !== null) { //Stuff is ok
    updateMessage('Stuff équipé');
    resetCurrentStuffLoadFail();

    getBorrowedCaItem().then(function(borrowedCaItem) {
      if(borrowedCaItem.length > 0) {
        returnBorrowedCaItem(callback, source);
        return;
      } else {
        callback(page);
        return;
      }
    });
  } else if(/L`ensemble incomplet!/.exec(source) !== null) { //Missing part in stuff
    updateMessage('Le stuff n\'est pas complet');
    stuffOn = -1;

    resetCurrentStuffLoadFail();

    if(canLaunchExpe) {
      canLaunchExpe = false;
    } else if(allExpeToJoin.length > 0) {
      allExpeToJoin = [];
    } else if(canLaunchKoth) {
      canLaunchKoth = false;
    } else if(allKothToJoin.length > 0) {
      allKothToJoin = [];
    } else {
      atkRunning = false;
      questRunning = false;
    }

    getBorrowedCaItem().then(function(borrowedCaItem) {
      if(borrowedCaItem.length > 0) {
        returnBorrowedCaItem(updateMode, source);
        return;
      } else {
        updateMode();
        return;
      }
    });
  } else {
    updateMessage('Une erreur a eu lieu lors du changement de stuff.');

    if(++currentStuffLoadFailed < MAX_STUFF_LOAD_FAIL) {
      updateStuff(callback, stuffOn);
      return;
    } else {
      updateMessage('Impossible de mettre le stuff à jour.');

      resetCurrentStuffLoadFail();

      if(canLaunchExpe) {
        canLaunchExpe = false;
      } else if(allExpeToJoin.length > 0) {
        allExpeToJoin = [];
      } else if(canLaunchKoth) {
        canLaunchKoth = false;
      } else if(allKothToJoin.length > 0) {
        allKothToJoin = [];
      } else {
        atkRunning = false;
        questRunning = false;
      }

      getBorrowedCaItem().then(function(borrowedCaItem) {
        if(borrowedCaItem.length > 0) {
          returnBorrowedCaItem(updateMode, source);
          return;
        } else {
          updateMode();
          return;
        }
      });
    }
  }
};

var syncXmlRequest = function(d) {
  return new Promise(function(resolve, reject) {
    const __D = { };

    Object.assign(__D, d);

    __D.onload = (result => {
      if (result.statusText === 'OK') {
        resolve(result);
      } else {
        reject(result.statusText);
      }
    });

    if (__XMLREQUEST) {
      __XMLREQUEST(__D);
    } else {
      reject("XHR handler is missing");
    }
  });
}

var updateMode = function(page) {
  if(cleanupRunning) {
    cleanup();
    return;
  }

  //*** TIMERS ***
  var now = new Date();
  var currentTime = now.getTime();
  var currentDay = now.getDay();
  var currentHours = now.getHours();
  var currentMinutes = now.getMinutes();
  var currentSeconds = now.getSeconds();

  // Update expedition and KotH infos
  if((nextExpeTime !== null && nextExpeTime - now < 0) || (currentMinutes % 30 >= 25 && currentTime - lastExpeCheckTime > MIN_INTERVAL_BETWEEN_EVENT_CHECK)) {
    updateMessage('Mise à jour du temps de prochaine expédition');
    lastExpeCheckTime = currentTime;
    loadPage('POST', EXPE_PAGE_URL, '', loadNextEventInfos);
    return;
  } else if((nextSwrTime !== null && nextSwrTime - now < 0) || ((currentMinutes < 5 || (30 <= currentMinutes && currentMinutes < 35)) && currentTime - lastSwrCheckTime > MIN_INTERVAL_BETWEEN_EVENT_CHECK)) {
    updateMessage('Mise à jour du temps de prochain rdc');
    lastSwrCheckTime = currentTime;
    loadPage('POST', SWR_PAGE_URL, '', loadNextEventInfos);
    return;
  }

  //*** UTILS STUFF ***
  //From now on we need a page for further checks
  if(typeof page === 'undefined') {
    loadPage('POST', MAIN_URL, '', updateMode);
    return;
  } else {
    getSource(page);
  }

  //*** CHECK EVENTS ***
  var expeInTheNextMinutes = nextExpeTime !== null && nextExpeTime - now < FIVE_MINUTES_IN_MS;
  var kothInTheNextMinutes = nextSwrTime !== null && nextSwrTime - now < FIVE_MINUTES_IN_MS;
  var arena3V3InTheNextMinutes = (currentDay === 1 || currentDay === 4) && currentHours === 21 && 5 <= currentMinutes && currentMinutes < 11;
  var arenaClanVClanInTheNextMinutes = currentDay === 0 && currentHours === 21 && 5 <= currentMinutes && currentMinutes < 11;
  var eventsInTheNextMinutes = expeInTheNextMinutes || kothInTheNextMinutes || arena3V3InTheNextMinutes || arenaClanVClanInTheNextMinutes;

  if(expeInTheNextMinutes && stuffOn !== getExpeStuff()) {
    updateStuff(reloadUpdateModeLater, getExpeStuff());
    return;
  }

  if(kothInTheNextMinutes && stuffOn !== RDC_STUFF) {
    updateStuff(reloadUpdateModeLater, RDC_STUFF);
    return;
  }

  if(arena3V3InTheNextMinutes && stuffOn !== ARENA_3_V_3_STUFF) {
    updateStuff(reloadUpdateModeLater, ARENA_3_V_3_STUFF);
    return;
  }

  if(arenaClanVClanInTheNextMinutes && stuffOn !== ARENA_CLAN_V_CLAN_STUFF) {
    updateStuff(reloadUpdateModeLater, ARENA_CLAN_V_CLAN_STUFF);
    return;
  }

  //*** CHECK AUCTIONS ***
  if(now - lastAuctionCheckTime  > INTERVAL_AUCTION_CHECK_TIME || (nextAuctionTime !== null && nextAuctionTime - now <= FOURTY_SECONDS_IN_MS)) {
    loadPage('POST', AUCTION_PAGE_URL, '', manageAuction);
    return;
  }

  if(nextAuctionTime !== null && nextAuctionTime - now <= FOUR_MINUTES_IN_MS) {
    if(!auctionEndingSoon) {
      auctionEndingSoon = true;
      updateMessage('Une vente aux enchères va se terminer. Mise en attente pour enchérir');
    }
  } else {
    auctionEndingSoon = false;
  }

  //*** CHECK ENOUGH LOL ***
  if(getCurrentLol(page) < MIN_LOL) {
    sellJunks(updateMode);
    return;
  }

  //*** MANAGE THE MODE ***
  if(eventsInTheNextMinutes || auctionEndingSoon) {
    reloadUpdateModeLater(page);
    return;
  }

  if(currentTime - lastArenaCheckTime > MIN_INTERVAL_BETWEEN_ARENA_CHECK) {
    updateMessage('Vérifie s\'il y a des arènes à lancer/rejoindre');
    lastArenaCheckTime = currentTime;
    launchAndJoinArena();
    return;
  }

  if(canLaunchExpe && isAuthorizedToLaunch(EXPE_TO_LAUNCH)) {
    updateMessage('Il y a une expédition à lancer');
    launchExpe();
    return;
  }

  if(allExpeToJoin.length > 0 && currentTime - lastTryToJoinExpeTime > MIN_INTERVAL_BETWEEN_EVENT_CHECK) {
    updateMessage('Il y a des expédition à rejoindre');
    loadPage('POST', EXPE_PAGE_URL, '', joinExpe);
    return;
  }

  if(canLaunchKoth && isAuthorizedToLaunch(RDC_TO_LAUNCH)) {
    updateMessage('Il y a un rdc à lancer');
    launchKoth();
    return;
  }

  if(STUFF_TO_JOIN_RDC !== -1 && allKothToJoin.length > 0 && currentTime - lastTryToJoinKothTime > MIN_INTERVAL_BETWEEN_EVENT_CHECK) {
    updateMessage('Il y a des rdc à rejoindre');
    loadPage('POST', SWR_PAGE_URL, '', joinKoth);
    return;
  }

  if(atkRunning) {
    if(lastRunningMode !== 'atk') {
      updateMessage('Début du mode de lancement d\'attaques');
      lastRunningMode = 'atk';
    }
    loadPage('POST', ATK_PAGE_URL, '', updateAtkMode);
    return;
  } else if(questRunning) {
    if(lastRunningMode !== 'quest') {
      updateMessage('Début du mode de lancement de quêtes');
      lastRunningMode = 'quest';
    }
    loadPage('POST', QUEST_PAGE_URL, '', updateQuestMode);
    return;
  } else {
    if(lastRunningMode) {
      if(lastRunningMode === 'atk') {
        updateMessage('Fin du mode de lancement d\'attaques');
      } else if (lastRunningMode === 'quest') {
        updateMessage('Fin du mode de lancement de quêtes');
      }

      lastRunningMode = null;
      cleanup();
      return;
    }

    if(currentTime - lastTimeAtkRan > 1.5 * HOUR_IN_S * SECONDS_IN_MS) {
      atkRunning = true;
      updateMode(page);
      return;
    } else if(currentTime - lastTimeQuestRan > HOUR_IN_S * SECONDS_IN_MS) {
      questRunning = true;
      updateMode(page);
      return;
    } else {
      if(stuffOn !== DEF_STUFF) {
        updateStuff(reloadUpdateModeLater, DEF_STUFF);
        return;
      } else {
        reloadUpdateModeLater(page);
        return;
      }
    }
  }
};


//******************* Launch atk - DO NOT TOUCH *******************

var updateAtkMode = function(atkPage) {
  lastTimeAtkRan = new Date().getTime();

  var source = getSource(atkPage);
  var atkLeftRegexResult = /Attaques restantes: <b>(\d+)<\/b>/.exec(source);
  if(atkLeftRegexResult === null) {
    updateMessage('Je n\'ai pas réussi à lire le nombre d\'attaque restantes');
    updateMode();
    return;
  } else {
    var atkLeft = parseInt(atkLeftRegexResult[1], DECIMAL_BASE);
    updateMessage('Attaques restantes : ' + atkLeft);

    if(atkLeft > 0) {
      findNextAtkTarget();
      return;
    } else {
      atkRunning = false;
      updateMode();
      return;
    }
  }
};

var findNextAtkTarget = function(page) {
  currentAtkIdx = (currentAtkIdx + 1) % AVAILABLE_ATK_TARGET.length;
  var nextTarget = AVAILABLE_ATK_TARGET[currentAtkIdx];
  loadPage('POST', PROFILE_PAGE_URL + nextTarget.id, '', tryToAtk);
  return;
};

var tryToAtk = function(targetPage) {
  var source = getSource(targetPage);
  var nickArray = /Profil du vampire (.*?)(?:&nbsp;<\/div>)/.exec(source) || /Profil du vampire (.*?)\r?\n/.exec(source);
  var nick = nickArray[1].trim();
  var isAtkable = /">ATTAQUER<\/a>/.exec(source) !== null && /<span class="disabled"> \(/.exec(source) === null;
  var zoneInfo = /townview&amp;strefa=\d+&amp;sektor=\d+">\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)/.exec(source);

  var target = AVAILABLE_ATK_TARGET[currentAtkIdx];
  target.strefa = zoneInfo[1];
  target.sektor = zoneInfo[2];
  target.kwadrat = zoneInfo[3];

  if(isAtkable) {
    updateMessage('Je peux attaquer ' + nick + ' qui est sur la zone ' + target.strefa + ' / ' + target.sektor + ' / ' + target.kwadrat);

    var targetStuff = target.stuff || DEFAULT_ATK_STUFF;
    if(stuffOn !== targetStuff) {
      updateStuff(launchAtk, targetStuff);
      return;
    } else {
      launchAtk();
      return;
    }
  } else {
    updateMessage('Je ne peux pas attaquer ' + nick + ' qui est sur la zone ' + target.strefa + ' / ' + target.sektor + ' / ' + target.kwadrat);
    findNextAtkTarget();
    return;
  }
};

var launchAtk = function(page) {
  if(typeof page !== 'undefined') {
    getSource(page);
  }

  var target = AVAILABLE_ATK_TARGET[currentAtkIdx];
  var data = 'strefa=' + target.strefa + '&sektor=' + target.sektor + '&kwadrat=' + target.kwadrat + '&submit=ATTAQUER' + arkEvoFor(typeof target.arkEvoList !== 'undefined' ? target.arkEvoList : DEFAULT_ATK_ARK_EVO) + '&akey=' + currentAccessKey + '&taxi=4';
  loadPage('POST', BASE_URL + '/?a=ambush&opt=atk&st=' + target.strefa + '&sc=' + target.sektor + '&sq=' + target.kwadrat, data, atkJustLaunched);
  return;
};

var atkJustLaunched = function(ambushPage) {
  var source = getSource(ambushPage);

  if(/<td class="error">Vous n`avez pas assez de sang<\/td>/.exec(source)) {
    updateMessage('Manque de sang pour mettre les arcanes correspondantes, changement de mode');
    atkRunning = false;
    updateMode();
    return;
  } else if(/<td class="error">Ce joueur ne peut plus/.exec(source) !== null) {
    updateMessage('Le joueur a déjà été attaqué 2 fois aujourd\'hui');
    findNextAtkTarget();
    return;
  } else {
    var atkTimeLeft = /class="attackinprogress">(\d+):(\d+):(\d+)<\/span><\/div>/.exec(source);

    if(atkTimeLeft === null) {
      //Failed to launch the atk for some reason, like a the player change a page and the akey was wrong
      console.log(source);
      updateMessage('Suite à une erreur, l\'attaque n\'a pas été lancée');
      findNextAtkTarget();
      return;
    } else {
      var atkTimeLeftInS = timeArrayInS(atkTimeLeft[1] | 0, atkTimeLeft[2] | 0, atkTimeLeft[3] | 0);
      updateMessage('Attaque en cours, elle dure : ' + atkTimeLeftInS + ' secondes');
      setTimeout(updateMode, atkTimeLeftInS * MARGIN_COEF);
      return;
    }
  }
};


//******************* Launch Quest - DO NOT TOUCH *******************

var updateQuestMode = function(questPage) {
  lastTimeQuestRan = new Date().getTime();

  var source = getSource(questPage);

  var questLeftArray = /Les quêtes restantes: <b>(\d+)<\/b>/.exec(source);
  if(questLeftArray === null) {
    loadPage('POST', QUEST_PAGE_URL, '', updateQuestMode);
    return;
  }

  var questLeft = parseInt(questLeftArray[1], DECIMAL_BASE);
  updateMessage('Quêtes restantes : ' + questLeft);

  if(questLeft > 0) {
    if(stuffOn !== QUEST_STUFF) {
      updateStuff(updateQuestMode, QUEST_STUFF);
      return;
    } else {
      if(!questMessageSent) {
        //sendShoutboxMessage('clan', getNextQuestMessage(questLeft));
      }
      questMessageSent = true;
      launchNextQuest();
      return;
    }
  } else {
    questMessageSent = false;
    questRunning = false;
    updateMode();
    return;
  }
};

var launchNextQuest = function(page) {
  if(typeof page !== 'undefined') {
    getSource(page);
  }

  if(selectedOuu !== -1) {
    updateMessage('Achat de l\'ouu : ' + OUU_NAME_BY_ID[selectedOuu]);
    loadPage('POST', TOWNSHOP_PAGE_URL + '&buyone=' + selectedOuu + '&akey=' + currentAccessKey, '', launchPilgrim);
    return;
  } else {
    launchPilgrim(page);
    return;
  }
};

var launchPilgrim = function(page) {
  if(typeof page !== 'undefined') {
    getSource(page);
  }

  updateMessage('Lancement d\'un nouveau pèlerinage');
  loadPage('POST', QUEST_PAGE_URL, 'questDiff=2&onetimeSelected=0&questNum=1' + arkEvoFor(QUEST_ARK_EVO) + '&akey=' + currentAccessKey + '&submit=COMMENCER+LA+QU%C3%8ATE', questJustLaunched);
  return;
};

var questJustLaunched = function(questPage) {
  var source = getSource(questPage);
  var questTimeLeft = /id="quest_timeleft".*?>(\d+):(\d+):(\d+)<\//.exec(source);

  if(questTimeLeft === null) {
    //Failed to launch the quest for some reason, like a the player change a page and the akey was wrong
    updateMessage('Suite à une erreur, la quête n\'a pas été lancée');
    updateMode();
    return;
  } else {
    var questTimeLeftInS = timeArrayInS(questTimeLeft[1] | 0, questTimeLeft[2] | 0, questTimeLeft[3] | 0);
    updateMessage('Quête en cours, elle dure : ' + questTimeLeftInS + ' secondes');
    setTimeout(updateMode, questTimeLeftInS * MARGIN_COEF);
    return;
  }
};


//******************* Manage Auction - DO NOT TOUCH *******************

var manageAuction = function(auctionPage) {
  lastAuctionCheckTime = new Date();
  var i;

  var source = getSource(auctionPage);

  // Init items with all items in auction 1st page and set their minOverbid
  var itemsRegexResult = source.match(/auData\[\d+\]\.minOverbid = \d+;/g);
  var items = {};

  if(itemsRegexResult !== null) {
    for(i = 0; i < itemsRegexResult.length; ++i) {
      var itemRegexResult = itemsRegexResult[i];

      var itemRegexInfo = /auData\[(\d+)\]\.minOverbid = (\d+);/.exec(itemRegexResult);
      var itemId = itemRegexInfo[1];
      var itemMinOverbid = itemRegexInfo[2];
      var itemActBidRegexResult = new RegExp("auData\\[" + itemId + "\\]\\.actBid = (\\d+);").exec(source);
      items[itemId] = {
        minOverbid: parseInt(itemMinOverbid, DECIMAL_BASE),
        hasAnOffer: itemActBidRegexResult !== null && parseInt(itemActBidRegexResult[1], DECIMAL_BASE) > 0
      };
    }

    // Add item names
    var itemNamesRegexResult = source.match(/auData\[\d+\]\.name = '.*?';/g);
    for(i = 0; i < itemNamesRegexResult.length; ++i) {
      var itemNameRegexResult = itemNamesRegexResult[i];

      var itemNameRegexInfo = /auData\[(\d+)\]\.name = '(.*?)';/.exec(itemNameRegexResult);
      items[itemNameRegexInfo[1]].name = itemNameRegexInfo[2];
    }

    // Iterate all auctions in order to find the first auction that is interesting to buy
    var auctions = source.match(/<tr id="au_\d+"(.*\r?\n)+?.*\d{4}-\d{2}-\d{2}<br \/>\d{2}:\d{2}:\d{2}/g);
    for(i = 0; i < auctions.length; ++i) {
      var auction = auctions[i];

      var auctionInfo = /<tr id="au_(\d+)"(.*\r?\n)+?.*(\d{4})-(\d{2})-(\d{2})<br \/>(\d{2}):(\d{2}):(\d{2})/.exec(auction);
      var auctionItemId = auctionInfo[1];
      var auctionInfoLength = auctionInfo.length;
      var endTime = new Date(parseInt(auctionInfo[auctionInfoLength-6], DECIMAL_BASE), parseInt(auctionInfo[auctionInfoLength-5], DECIMAL_BASE) - 1, parseInt(auctionInfo[auctionInfoLength-4], DECIMAL_BASE), parseInt(auctionInfo[auctionInfoLength-3], DECIMAL_BASE), parseInt(auctionInfo[auctionInfoLength-2], DECIMAL_BASE), parseInt(auctionInfo[auctionInfoLength-1], DECIMAL_BASE));

      var auctionItemPriceArray = /<tr id="au_(\d+)"(.*\r?\n)+?.*Prix de vente:<\/b>\D*(\d.*?)LOL/.exec(auction);
      var junkCount;
      if(auctionItemPriceArray) {
        var auctionItemPrice = parseInt(auctionItemPriceArray[auctionItemPriceArray.length - 1].replace(/ /g, ''), DECIMAL_BASE);
        junkCount = auctionItemPrice / 20000;
      } else {
        var auctionJunkCountArray = /<tr id="au_(\d+)"(.*\r?\n)+?.*Ferraille pièces:(.*?)</.exec(auction);
        junkCount = parseInt(auctionJunkCountArray[auctionJunkCountArray.length -1].replace(/ /g, ''), DECIMAL_BASE);
      }

      var item = items[auctionItemId];
      var maxPrice = Math.floor(JUNK_AUCTION_PRICE * junkCount);
      //Override maxPrice if this is a high class item that we really want to buy
      for(itemToBuy of ITEMS_TO_BUY) {
        var isAnItemToBuy = item.operator === 'endsWith' ? item.name.endsWith(itemToBuy.name) : item.name.startsWith(itemToBuy.name);
        if(isAnItemToBuy && item.hasAnOffer) {
          maxPrice = itemToBuy.maxPrice || Number.MAX_SAFE_INTEGER;
          updateMessage('Un item d\'exception à été trouvé: ' + item.name + '. Prêt à enchérir jusqu\'à ' + maxPrice + 'pdp. Fin de l\'enchère à ' + endTime);
        }
      }
      
      if(item.minOverbid <= maxPrice) {
        nextAuctionTime = endTime;
        if(!auctionInfo[0].includes('Ton offre l`emporte') && endTime - new Date() <= FOURTY_SECONDS_IN_MS) {
          var itemName = items[auctionItemId].name.replace(/ /g,'+');
          var data = 'off=' + item.minOverbid + '&auId=' + auctionItemId + '&bid=ENCHÉRIR+-+' + itemName;
          updateMessage('Enchere : ' + data);
          loadPage('POST', AUCTION_PAGE_URL, data, updateMode.bind(null, auctionPage));
          return;
        }

        reloadUpdateModeLater(auctionPage, 5);
        return;
      }
    }
  }

  // No interesting auction found
  nextAuctionTime = null;
  updateMode(auctionPage);
  return;
};

//******************* Join/Launch arena - DO NOT TOUCH *******************
var nextArenaCategoryToCheck = 1;
var launchAndJoinArena = function(arenaPage) {
  switch(nextArenaCategoryToCheck) {
    case 1:
      launch1V1Arena(arenaPage);
      return;
    case 2:
      launch3V3Arena(arenaPage);
      return;
    case 3:
      launchClanVClanArena(arenaPage);
      return;
    default:
      // As we will increment arena category to check, we will reset the whole thing here
      nextArenaCategoryToCheck = 1;
      updateMode();
      return;
  }
};

var launch1V1Arena = function(arenaPage, url) {
  if(arenaPage === null || typeof arenaPage === 'undefined' || /newarena&cat=1/.exec(url) === null) {
    loadPage('POST', ARENA_1_V_1_PAGE_URL, '', launch1V1Arena);
    return;
  }

  var source = getSource(arenaPage);
  var canFight1V1 = /<input class="button actionButton" type="submit" name="doFight" value="COMBATS!"\/>/.exec(source);
  if(canFight1V1) {
    updateMessage('Il y a une arène 1v1 à lancer');

    if(stuffOn !== ARENA_1_V_1_STUFF) {
      updateStuff(launch1V1Arena, ARENA_1_V_1_STUFF);
      return;
    }

    ++nextArenaCategoryToCheck;
    var data = arkEvoFor(ARENA_1_V_1_ARK_EVO) + '&onetimeSelected=' + ARENA_1_V_1_OUU + '&doFight=COMBATS%21';
    loadPage('POST', ARENA_1_V_1_PAGE_URL, data, launchAndJoinArena);
    return;
  } else {
    updateMessage('Arène 1v1 déjà lancée');

    ++nextArenaCategoryToCheck;
    launchAndJoinArena();
    return;
  }
};

var launch3V3Arena = function(arenaPage, url) {
  if(arenaPage === null || typeof arenaPage === 'undefined' || /newarena&cat=2/.exec(url) === null) {
    loadPage('POST', ARENA_3_V_3_PAGE_URL, '', launch3V3Arena);
    return;
  }

  var source = getSource(arenaPage);
  var myPseudo = getMyPseudoFromSource(source);

  var notInA3V3 = /onclick="return onJoinTeamSubmit/.exec(source) || (myPseudo !== null && new RegExp('<span.*?>' + myPseudo + '<\\/span>').exec(source) === null);
  if(notInA3V3) {
    updateMessage('Il y a une arène 3v3 à lancer ou joindre');
    if(stuffOn !== STUFF_TO_JOIN_3_V_3_ARENA) {
      updateStuff(launch3V3Arena, STUFF_TO_JOIN_3_V_3_ARENA);
      return;
    }

    var arenaLaunchedByTeamMemberId = null;

    var allTeamCreatedBy = source.match(/id="expDesc_(\d+)"/g);
    for(var i = 0; arenaLaunchedByTeamMemberId === null && allTeamCreatedBy !== null && i < allTeamCreatedBy.length; ++i) {
      var teamCreatedBy = parseInt(/id="expDesc_(\d+)"/.exec(allTeamCreatedBy[i])[1], DECIMAL_BASE);

      console.log(ARENA_3_V_3_TO_LAUNCH);
      console.log(teamCreatedBy);
      if(ARENA_3_V_3_TO_LAUNCH.invites.includes(teamCreatedBy)) {
        arenaLaunchedByTeamMemberId = teamCreatedBy;
      }
    }

    ++nextArenaCategoryToCheck;
    if(arenaLaunchedByTeamMemberId !== null) {
      // Join the existing 3V3
      var data = 'join=' + arenaLaunchedByTeamMemberId + arkEvoFor(ARK_EVO_TO_JOIN_3_V_3_ARENA) + '&onetimeSelected=' + ARENA_3_V_3_OUU + '&joinTeam=Joindre+l%60%C3%A9quipe+choisie';
      loadPage('POST', ARENA_3_V_3_JOIN_PAGE_URL, data, launchAndJoinArena);
      return;
    } else {
      // Launch a new 3v3
      var data = arkEvoFor(ARK_EVO_TO_JOIN_3_V_3_ARENA) + '&onetimeSelected=' + ARENA_3_V_3_OUU + '&submit=Pr%C3%A9senter+une+nouvelle+%C3%A9quipe';
      loadPage('POST', ARENA_3_V_3_LAUNCH_PAGE_URL, data, manageInvitesOnLaunchedEvent.bind(null, ARENA_3_V_3_TO_LAUNCH, launchAndJoinArena));
      return;
    }
  } else {
    updateMessage('Arène 3v3 déjà lancée/rejointe');

    ++nextArenaCategoryToCheck;
    launchAndJoinArena();
    return;
  }
};

var launchClanVClanArena = function(arenaPage, url) {
  if(arenaPage === null || typeof arenaPage === 'undefined' || /newarena&cat=3/.exec(url) === null) {
    loadPage('POST', ARENA_CLAN_V_CLAN_PAGE_URL, '', launchClanVClanArena);
    return;
  }

  var source = getSource(arenaPage);

  var canJoinClanVClan = /<input type="submit" class="button actionButton" name="joinClanArena" id="joinClanArena" value="REJOINS L`ARENE"/.exec(source);

  if(canJoinClanVClan) {
    updateMessage('Il y a une arène clan v clan à lancer');

    if(stuffOn !== STUFF_TO_JOIN_CLAN_V_CLAN_ARENA) {
      updateStuff(launchClanVClanArena, STUFF_TO_JOIN_CLAN_V_CLAN_ARENA);
      return;
    }

    ++nextArenaCategoryToCheck;
    var data = arkEvoFor(ARK_EVO_TO_JOIN_CLAN_V_CLAN_ARENA) + '&onetimeSelected=' + ARENA_CLAN_V_CLAN_OUU + '&joinClanArena=REJOINS+L%60ARENE'
    loadPage('POST', ARENA_CLAN_V_CLAN_PAGE_URL, data, launchAndJoinArena);
    return;
  } else {
    updateMessage('Arène clan déjà rejointe');

    ++nextArenaCategoryToCheck;
    launchAndJoinArena();
    return;
  }
};

//******************* Join/Launch events - DO NOT TOUCH *******************

var joinExpe = function(expePage) {
  lastTryToJoinExpeTime = new Date().getTime();

  var source = getSource(expePage);
  if(/La possibilité de joindre la prochaine expédition/.exec(source) === null) {
    loadPage('POST', EXPE_PAGE_URL, '', joinExpe);
    return;
  }

  completeAllExpeToJoin(source, allExpeToJoin); // Complete the following information: launcherId, location, numberOfPlayer, maxNumberOfPlayer, isCut
  var hasJoinedAnExpeToday = /La possibilité de joindre la prochaine expédition: <b>MAINTENANT<\/b><\/td>/.exec(source) === null || /cancelJoin(?:.*\r?\n){4}\s*\r?\n/.exec(source) !== null;
  if(allExpeToJoin.length <= 0) {
    allExpeToJoin = [];
    updateStuff(updateMode, DEF_STUFF);
    return;
  } else {
    var nextExpeStuffToWear = -1;
    for(var i = 0; i < allExpeToJoin.length; ++i) {
      var expe = allExpeToJoin[i];
      if(expe.isCut && expe.maxNumberOfPlayer !== null) {
        continue;
      }

      var expeStuff = EXPE_STUFF_TO_JOIN_LOCATION[expe.location] || DEFAULT_STUFF_TO_JOIN_EXPE;
      var expeArkEvo = EXPE_ARK_EVO_TO_JOIN_LOCATION[expe.location] || DEFAULT_ARK_EVO_TO_JOIN_EXPO;
      if(expeStuff !== -1 && (expe.maxNumberOfPlayer === null || expe.numberOfPlayer < expe.maxNumberOfPlayer)) {
        if(stuffOn === expeStuff) {
          allExpeToJoin.splice(i, 1);

          updateMessage('En train de joindre l\'expédition ' + expe.id);
          if(true || !hasJoinedAnExpeToday || expe.location !== NON_SAMA_EXPO_TO_JOIN.location) {
           	var iAmNotSamaritan = !hasJoinedAnExpeToday && expe.location === NON_SAMA_EXPO_TO_JOIN.location && (NON_SAMA_EXPO_TO_JOIN.maxParticipant === null || (expe.numberOfPlayer < NON_SAMA_EXPO_TO_JOIN.maxParticipant && expe.maxNumberOfPlayer !== null && expe.maxNumberOfPlayer <= NON_SAMA_EXPO_TO_JOIN.maxParticipant));
            var ouu = iAmNotSamaritan ? OUU_TO_LAUNCH_EXPO : 0;
            var data = 'join%5B%5D=' + expe.id + '&samarytanin=' + (iAmNotSamaritan ? '0' : '1') + arkEvoFor(expeArkEvo) + '&onetimeSelected=' + ouu + '&joinEvent=Joindre+les+exp%C3%A9ditions+choisies';
            loadPage('POST', EXPE_JOIN_PAGE_URL, data, joinExpe);
            return; 
          } else {
            // Do not join an expe as non samaritain while I might join it myself after midnight
          }
        } else if(nextExpeStuffToWear === -1) {
          nextExpeStuffToWear = expeStuff;
        } else {
          // We will join this expe later
        }
      } else {
        allExpeToJoin.splice(i--, 1); // No stuff selected to join the expe or the expe is already full, so just remove it and continue the loop
        if(expe.numberOfPlayer < expe.maxNumberOfPlayer) {
          updateMessage('Pas de stuff sélectionné pour joindre le site ' + expe.location);
        } else {
          updateMessage('L\'expédition ' + expe.id + ' est complète');
        }
      }
    }

    // We joined all the expe that could be joined with this stuff
    if(nextExpeStuffToWear !== -1) {
      updateStuff(joinExpe, nextExpeStuffToWear, expePage);
      return;
    } else {
      allExpeToJoin = [];
      updateStuff(updateMode, DEF_STUFF);
      return;
    }
  }
};

var launchExpe = function() {
  var expeStuff = EXPE_STUFF_TO_JOIN_LOCATION[EXPE_TO_LAUNCH.location] || DEFAULT_STUFF_TO_JOIN_EXPE;
  if(stuffOn !== expeStuff) {
    updateStuff(launchExpe, expeStuff);
    return;
  }

  loadPage('GET', EXPE_SACRIFICE_PAGE_MAP_2_URL, '', tryLaunchingExpeThroughSacrifice);
  return;
};

var tryLaunchingExpeThroughSacrifice = function(sacrificePage) {
  var source = getSource(sacrificePage);
  var re = new RegExp('\\{"location":' + EXPE_SITE[EXPE_TO_LAUNCH.location] + ',"revived":\\d+,"actPts":(\\d+),"repCost":(\\d+),"pplCost":(\\d+),"actPpl":(\\d+),"canSacrifice":(\\d+)\\}');
  var regexpResult = re.exec(source);

  var reputationNeeded = (regexpResult[2] | 0) - (regexpResult[1] | 0);
  var populationNeeded = (regexpResult[3] | 0) - (regexpResult[4] | 0);
  var canSacrifice = re.exec(source)[1] | 0;

  var myReputation = /var playerRep = (\d+);/.exec(source)[1] | 0;
  var myPopulation = /var playerPpl = (\d+);/.exec(source)[1] | 0;

  canLaunchExpe = false;
  var expeArkEvo = EXPE_ARK_EVO_TO_JOIN_LOCATION[EXPE_TO_LAUNCH.location] || DEFAULT_ARK_EVO_TO_JOIN_EXPO;
  if(canSacrifice && myReputation > reputationNeeded && myPopulation > populationNeeded) {
    updateMessage('En train de faire un sacrifice pour lancer une expedition sur le site ' + EXPE_TO_LAUNCH.location);
    var data = 'locsel=' + EXPE_SITE[EXPE_TO_LAUNCH.location] + '&sac_pts=' + reputationNeeded + '&startExp=on' + arkEvoFor(expeArkEvo) + '&onetimeSelected=' + OUU_TO_LAUNCH_EXPO + '&sacrifice=SACRIFIE';
    loadPage('POST', EXPE_SACRIFICE_PAGE_MAP_2_URL, data, manageInvitesOnLaunchedEvent.bind(null, EXPE_TO_LAUNCH, null));
    return;
  } else {
    updateMessage('En train de lancer une expedition avec la chasse sur le site ' + EXPE_TO_LAUNCH.location);
    var data = 'locsel=' + EXPE_SITE[EXPE_TO_LAUNCH.location] + '&ceCostType=1' + arkEvoFor(expeArkEvo) + '&onetimeSelected=' + OUU_TO_LAUNCH_EXPO + '&code_check=&submit=LANCER+L%60EXP%C3%89DITION';
    loadPage('POST', EXPE_LAUNCH_PAGE_MAP_2_URL, data, manageInvitesOnLaunchedEvent.bind(null, EXPE_TO_LAUNCH, null));
    return;
  }
};

var joinKoth = function(swrPage) {
  lastTryToJoinKothTime = new Date().getTime();
  if(stuffOn !== STUFF_TO_JOIN_RDC) {
    updateStuff(joinKoth, STUFF_TO_JOIN_RDC, swrPage);
    return;
  }

  var source = getSource(swrPage);
  if(/Possibilité de rejoindre une expédition Roi de la Colline/.exec(source) === null) {
    loadPage('POST', SWR_PAGE_URL, '', joinKoth);
    return;
  }

  completeAllExpeToJoin(source, allKothToJoin); // Complete the following information: launcherId, location, numberOfPlayer, maxNumberOfPlayer, isCut
  var koth = allKothToJoin.shift();
  if(typeof koth !== 'undefined') {
    updateMessage('En train de joindre le rdc ' + koth.id);
    var iAmSamaritan = /Possibilité de rejoindre une expédition Roi de la Colline: <b>MAINTENANT<\/b></.exec(source) === null || /cancelJoin/.exec(source) !== null;
    var data = 'join%5B%5D=' + koth.id + '&samarytanin=' + (iAmSamaritan ? '1' : '0') + arkEvoFor(ARK_EVO_TO_JOIN_RDC) + '&onetimeSelected=0&joinEvent=Joindre+les+exp%C3%A9ditions+choisies';
    loadPage('POST', SWR_JOIN_PAGE_URL, data, joinKoth);
    return;
  } else {
    updateStuff(updateMode, DEF_STUFF);
    return;
  }
};

var launchKoth = function() {
  if(stuffOn !== STUFF_TO_JOIN_RDC) {
    updateStuff(launchKoth, STUFF_TO_JOIN_RDC);
    return;
  }

  canLaunchKoth = false;
  updateMessage('En train de lancer un rdc sur le site ' + RDC_TO_LAUNCH.location);
  var data = 'locsel=' + RDC_SITE[RDC_TO_LAUNCH.location] + arkEvoFor(ARK_EVO_TO_JOIN_RDC) + '&onetimeSelected=0submit=LANCER+L%60EXP%C3%89DITION';
  loadPage('POST', SWR_LAUNCH_PAGE_URL, data, manageInvitesOnLaunchedEvent.bind(null, RDC_TO_LAUNCH, null));
  return;
};

var manageInvitesOnLaunchedEvent = function(eventLaunched, callback, page) {
  if(!eventLaunched.inviteAll && (!eventLaunched.invites || eventLaunched.invites.length === 0)) {
    manageEventClosing(eventLaunched, callback, page);
    return;
  }

  updateMessage('En train d\'inviter des joueurs sur l\'évènement');

  var source = getSource(page);
  if(/do=current" class="active"/.exec(source) === null) {
    loadPage('POST', eventLaunched.eventJoinPageUrl, '', manageInvitesOnLaunchedEvent.bind(null, eventLaunched, callback));
    return;
  }

  var inviteIds = [];
  if(eventLaunched.inviteAll) {
    updateMessage('En train d\'inviter tout le clan');

    var invites = source.match(/id="invite_(\d+)"/g);
    for(var i = 0; invites !== null && i < invites.length; ++i) {
      inviteIds.push(/id="invite_(\d+)"/.exec(invites[i])[1]);
    }
  } else {
    inviteIds = eventLaunched.invites;
  }

  var data = 'newDesc=';
  for(var i = 0; i < inviteIds.length; ++i) {
    var inviteId = inviteIds[i];
    data += '&invitelist%5B%5D=' + inviteId;
  }

  data += '&updateInvites=ACTUALISER+LA+LISTE+DES+INVITES';
  loadPage('POST', eventLaunched.eventJoinPageUrl, data, manageEventClosing.bind(null, eventLaunched, callback));
  return;
};

var manageEventClosing = function(eventLaunched, callback, page) {
  if(!eventLaunched.closeEvent) {
    updateDescOnLaunchedEvent(eventLaunched, callback, page);
    return;
  }

  loadPage('POST', eventLaunched.eventClosePageUrl, '', updateDescOnLaunchedEvent.bind(null, eventLaunched, callback));
  return;
};

var updateDescOnLaunchedEvent = function(eventLaunched, callback, page) {
  if(!eventLaunched.description) {
    updateMode();
    return;
  }

  var source = getSource(page);
  if(/do=current" class="active"/.exec(source) === null) {
    loadPage('POST', eventLaunched.eventJoinPageUrl, '', updateDescOnLaunchedEvent.bind(null, eventLaunched, callback));
    return;
  }

  updateMessage('En train de mettre à jour la description de l\'évènement');
  var actionId = /id="newDesc_(\d+)"/.exec(source)[1];
  var data = 'actionType=' + eventLaunched.actionType + '&actionId=' + actionId + '&newDesc=' + encodeURI(eventLaunched.description);
  loadPage('POST', eventLaunched.eventUpdateDescUrl, data, deadCall); // No return since deadCall just does nothing

  if(callback && callback !== null) {
    callback();
    return;
  } else {
    updateMode();
    return;
  }
};

var deadCall = function() {
  return;
};

//******************* UI - DO NOT TOUCH *******************

var textDiv = document.createElement('div');
var messages = [];
var updateMessage = function(newText, doNotDisplay) {
  var message = '[' + parseDate(new Date()) + '] ' + newText;

  //log the message first
  var logs;
  GM.getValue(SERV + '_bwAtkAndQuest_log').then(function(raw_logs) {  
    if(raw_logs) {
      logs = JSON.parse(raw_logs);
    } else {
      logs = [];
    }
    logs.push(message);
    if(logs.length > 2000) {
      logs.shift();
    }
    GM.setValue(SERV + '_bwAtkAndQuest_log', JSON.stringify(logs));

    //now update the message list
    if(!doNotDisplay) {
      messages.push(message);
      if(messages.length > 15) {
        messages.shift();
      }

      var txt = messages[0];
      for(var i = 1; i < messages.length; ++i) {
        txt += '<br>' + messages[i];
      }
      textDiv.innerHTML = txt;
    }
  });
};

var addUI = function() {
  var contentMidElement = document.getElementById('content-mid');

  var button = document.createElement('INPUT');
  button.type = 'button';
  button.value = 'Lancer le script de lancement d\'actions';
  button.className = 'button';
  button.id = 'scriptAtkQuestButton';

  var ouuLabel = document.createElement('P');
  ouuLabel.innerHTML = 'Ouu utilisé pour les quêtes : ';

  var ouuChoice = document.createElement('SELECT');
  ouuChoice.id = 'scriptQuestOuuSelect';
  ouuChoice.style.marginLeft = '10px';
  ouuChoice.options.add(new Option('Pas d\'ouu', -1, selectedOuu === -1, selectedOuu === -1));
  for (var i = 0; i < OUU_LIST.length; i++) {
    ouuChoice.options.add(new Option(OUU_LIST[i].name, OUU_LIST[i].id, selectedOuu === OUU_LIST[i].id, selectedOuu === OUU_LIST[i].id));
  }


  if(location.search === '?a=ambush') {
    contentMidElement.appendChild(button);
    contentMidElement.appendChild(ouuLabel);
    ouuLabel.appendChild(ouuChoice);
    contentMidElement.appendChild(textDiv);
  } else if (location.search === '?a=quest') {
    contentMidElement.insertBefore(textDiv, contentMidElement.firstChild);
    contentMidElement.insertBefore(ouuLabel, contentMidElement.firstChild);
    ouuLabel.appendChild(ouuChoice);
    contentMidElement.insertBefore(button, contentMidElement.firstChild);
  } else {
    return;
  }

  document.getElementById('scriptAtkQuestButton').addEventListener('click', function() {
    if(!scriptRunning) {
      scriptRunning = true;
      atkRunning = location.search === '?a=ambush' && !atkRunning;
      questRunning = location.search === '?a=quest' && !questRunning;
      updateMessage('Lancement du script');
      updateMode();
    }
  }, false);

  document.getElementById('scriptQuestOuuSelect').addEventListener('change', function(evt) {
    selectedOuu = parseInt(evt.target.value, DECIMAL_BASE);
    GM.setValue('bwAtkAndQuest_' + SERV + '_ouu', selectedOuu);
    updateMessage('Mise à jour de l\'ouu : ' + evt.target.selectedOptions[0].text.toLowerCase());
  }, false);
};

var init = function() {
  var displayLogs = true;
  if(displayLogs) {
    GM.getValue(SERV + '_bwAtkAndQuest_log').then(function(raw_logs) {
      if(raw_logs) {
        logs = JSON.parse(raw_logs);
        console.log(logs);
      }
    });
  }
  
  if (location.search === '?a=ambush' || location.search === '?a=quest') {
    GM.getValue('bwAtkAndQuest_' + SERV + '_ouu', -1).then(function(lastSelectedOuu) {
      selectedOuu = lastSelectedOuu;
      addUI();
    });
  }
};
init();
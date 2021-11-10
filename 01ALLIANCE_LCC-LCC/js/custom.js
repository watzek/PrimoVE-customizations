(function(){
"use strict";
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/************************************* BEGIN Bootstrap Script ************************************/


var app = angular.module('viewCustom', ['reservesRequest', 'customizationTwo', 'libraryHUD', 'clickableLogo', 'slaask', 'reportProblem', 'notOnShelf']);


//var app = angular.module('viewCustom', ['courseReserves', 'externalSearch',  'loginBackgrounds', 'libraryHUD', 'toggleInstitutions', 'clickableLogo', 'reportProblem', 'slaask', 'dbpasswords',  'oadoi']);

app.component('prmRequestServicesAfter', {
    template: '<reserves-request></reserves-request>'
  });


app.component('prmLogoAfter', {
  template: '<clickable-logo></clickable-logo>'
});

app.component('prmTopBarBefore', {
  template: '<slaask></slaask>'
});


app.component('prmActionListAfter',{
  template: '<report-problem></report-problem><customization-two></customization-two>'
});


app.component('prmSearchResultAvailabilityLineAfter', {
  template: '<not-on-shelf></not-on-shelf>'
});



/* example 2nd customization */
angular
  .module('customizationTwo', [])
  .component('customizationTwo',{
    template: '<p>Customization two!</p>'
  });



/****************** begin not on shelf *****************************/

angular.module('notOnShelf', []).component('notOnShelf', {
  bindings: { parentCtrl: '<' },
  controller: ['$scope', '$location', 'nosOptions', 'nosService', '$httpParamSerializer', function ($scope, $location, nosOptions, nosService, $httpParamSerializer) {
    $scope.checkBestLoc = function () {
      if (nosService.checkPage($location)) {
        console.log($scope);
        $scope.bestlocation = $scope.$parent.$parent.$ctrl.result.delivery.bestlocation;
        console.log($scope.bestlocation)
        if (!$scope.bestlocation || $scope.bestlocation.availabilityStatus == "unavailable") {
          console.log("ain't happening");
          return false;
        } else {
          console.log("happening!");
          var mainLocation = $scope.bestlocation.mainLocation;
          console.log(mainLocation);
          if (!nosOptions[0][mainLocation]) {
            console.log("no options for this location")
            return false; //not on
          } else {
            var subLocationCode = nosService.getSubLocationCode($scope);
            var codes = nosOptions[0][mainLocation][0]["locationCodes"];
            if (nosService.subLocationCodeCheck(subLocationCode, codes)) {
              var _params;

              var callNumber = nosService.getCallNumber($scope);
              var author = nosService.getAuthor($scope);
              var title = nosService.getTitle($scope);
              var location = nosService.getLocation($scope);

              var params = (_params = {}, _defineProperty(_params, nosOptions[0][mainLocation][0].query_mappings[0].title, title), _defineProperty(_params, nosOptions[0][mainLocation][0].query_mappings[0].author, author), _defineProperty(_params, nosOptions[0][mainLocation][0].query_mappings[0].location, location), _defineProperty(_params, nosOptions[0][mainLocation][0].query_mappings[0].callnumber, callNumber), _params);
              var urlBase = nosOptions[0][mainLocation][0].urlBase;
              $scope.url = nosService.buildUrl(urlBase, params, $httpParamSerializer);
              return true;
            } else {
              return false;
            }
          }
        }
      } else {
        /* brief result */
        return false;
      }
    };
  }],
  template: '<div  ng-show="checkBestLoc()"  style="margin-top:10px;"><p>Not on shelf? <a ng-href="{{url}}" target="_blank">Let us know.</a></p></div>'
}).factory('nosService', [function () {
  return {
    buildUrl: function buildUrl(url, params, $httpParamSerializer) {
      var serializedParams = $httpParamSerializer(params);
      if (serializedParams.length > 0) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }
      return url;
    },
    checkPage: function checkPage($location) {
      if ($location.path() === '/fulldisplay') {
        return true;
      } else {
        return false;
      }
    },
    getAuthor: function getAuthor($scope) {
      var obj = $scope.$parent.$parent.$ctrl.result.pnx.addata;
    //  console.log(obj);
      if (obj.hasOwnProperty("aulast")) {
        var author = encodeURIComponent($scope.$parent.$parent.$ctrl.result.pnx.addata.aulast[0]);
      } else {
        var author = "N/A";
      }
      return author;
    },
    getTitle: function getTitle($scope) {
      var obj = $scope.$parent.$parent.$ctrl.result.pnx.addata;
      if (obj.hasOwnProperty("btitle")) {
        var title = $scope.$parent.$parent.$ctrl.result.pnx.addata.btitle[0];
      } else {
        var title = "N/A";
      }
      return title;
    },
    getCallNumber: function getCallNumber($scope) {
      var cn = $scope.$parent.$parent.$ctrl.result.delivery.bestlocation.callNumber;
      var callNumber = cn.replace('(', '');
      var callNumber = callNumber.replace(')', '');
      return callNumber;
    },
    getLocation: function getLocation($scope) {
      if ($scope.delCat == "Alma-E") {
        var location = "Electronic Resource";
      } else {
        var mainLocation = $scope.$parent.$parent.$ctrl.result.delivery.bestlocation.mainLocation;
        var subLocation = $scope.$parent.$parent.$ctrl.result.delivery.bestlocation.subLocation;
        var location = mainLocation + " " + subLocation;
      }
      return location;
    },
    subLocationCodeCheck: function subLocationCodeCheck(code, codes) {
      var check = codes.indexOf(code);
    //  console.log(check);
      if (check == "-1") {
        return false;
      } else {
        return true;
      }
    },
    getSubLocationCode: function getSubLocationCode($scope) {
      console.log($scope)
      if ($scope.delCat == "Alma-E") {
        var subLocationCode = "Electronic Resource";
      } else {
        var subLocationCode = $scope.$parent.$parent.$ctrl.result.delivery.bestlocation.subLocationCode;
      }
      return subLocationCode;
    }
  };
}]);

app.value('nosOptions', [{
  "Watzek Library": [{
    "urlBase": "https://docs.google.com/forms/d/e/1FAIpQLSdBvdqmK0z1mHhg-ATiCHT94JVBuwdaaHzpyZJcK3XBGEP-IA/viewform?usp=pp_url",
    "query_mappings": [{
      'title': 'entry.956660822',
      'author': 'entry.1791543904',
      'callnumber': 'entry.865809076',
      'location': 'entry.431935401'
    }],
    "locationCodes": ["wmain", "wvid", "wref", "wdis", "wgovd", "wgovav", "wjuv", "weasy", "wnew", "wos", "wbalc", "wluo"]
  }],
  "Boley Law Library": [{
    "urlBase": "https://docs.google.com/forms/d/e/1FAIpQLSeevMvoTWs7JOw7BHvz1dXsRlAYpp9gi4qDByLU4NTrmvs2hQ/viewform?usp=pp_url",
    "query_mappings": [{
      'title': 'entry.956660822',
      'author': 'entry.1791543904',
      'callnumber': 'entry.865809076',
      'location': 'entry.431935401'
    }],
    "locationCodes": ["lsta", "lfed", "lhist", "lcv", "lenv", "lmain", "lstu"]
  }]
}]);

/***************** end not on shelf ********************************/



/******************* begin report a problem ************************/

angular.module('reportProblem', []).component('reportProblem', {
  template: '<div ng-if="show" class="bar filter-bar layout-align-center-center layout-row margin-top-medium" layout="row" layout-align="center center">\
        <span class="margin-right-small">{{ message }}</span>\
        <a ng-href="{{ link }}" target="_blank">\
            <button class="button-with-icon zero-margin md-button md-button-raised md-primoExplore-theme md-ink-ripple" type="button" aria-label="Report a Problem" style="color: #5c92bd;">\
                <prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new"></prm-icon>\
                <span style="text-transform: none;">{{ button }}</span>\
                <div class="md-ripple-container"></div>\
            </button>\
        </a>\
    </div>\
    ',
  controller: ['$scope', '$location', '$httpParamSerializer', 'reportProblemOptions', function ($scope, $location, $httpParamSerializer, reportProblemOptions) {
    $scope.message = reportProblemOptions.message;
    $scope.button = reportProblemOptions.button;
    $scope.show = $location.path() === '/fulldisplay';
    $scope.link = reportProblemOptions.base + $httpParamSerializer($location.search());
  }]
});

app.constant('reportProblemOptions', {
  message: "See something that doesn't look right?",
  button: "Report a Problem",
  base: "https://watzek.lclark.edu/primo/reportproblem-ve?"
});


/******************* end report a problem ************************/


/********************** begin slaask ******************************************/
angular.module('slaask', ['angularLoad']).component('slaask', {
  controller: ['angularLoad', 'slaask_id', function (angularLoad, slaask_id) {
    this.$onInit = function () {
      angularLoad.loadScript('https://cdn.slaask.com/chat.js').then(function () {
        return _slaask.init(slaask_id);
      });
    };
  }]
});
app.constant('slaask_id', '295dd444a1af2c9ab3456b7da45a415a');


/********************* end slaask ********************************************/



/************************* begin clickable logo ********************************/


app.constant('libraryLogoSmall', 'custom/01ALLIANCE_LCC-LCC/img/library-logo.png');

angular.module('clickableLogo', []).value('libraryLogoSmall', false).component('clickableLogo', {
  bindings: { parentCtrl: '<' },
  template: '\n    <div class="product-logo product-logo-local" layout="row" layout-align="start center" layout-fill id="banner" tabindex="0" role="banner">\n      <md-button aria-label="{{(\'nui.header.LogoAlt\' | translate)}}" ng-href="{{homeLink}}">\n        <img show-gt-xs hide-xs ng-src="{{ iconLink }}" alt="{{(\'nui.header.LogoAlt\' | translate)}}"/>\n        <img show-xs hide-gt-xs ng-src="{{ iconLinkSmall }}" alt="{{(\'nui.header.LogoAlt\' | translate)}}"/>\n      </md-button>\n    </div>\n    ',
  controller: ['$scope', '$location', 'libraryLogoSmall', function ($scope, $location, libraryLogoSmall) {
    console.log(this)
    var iconLink=$scope.$parent.$parent.$ctrl.iconLink;
    $scope.iconLink = iconLink;
    $scope.iconLinkSmall = libraryLogoSmall || iconLink;
    $scope.homeLink = '/discovery/search?vid=' + $location.search().vid;
  }]
});


/*********************** end clickable logo ***********************************/


/************************** begin reserves request ******************************/

angular
  .module('reservesRequest', [])
  .constant('reserveRequestOptions', {
    instCode : "01ALLIANCE_LCC", /* code of your library  */
    formatDenyList : ["journal"],  /* formats for which this will not appear  */
    userGroupAllowedlist : ["2","3"],   /* array of whitelisted group members who will see this when authenticated    */
    selectProps : {
      "value": "3 hours", /* initial default text display in select menu  */
      "values": ["3 hours"], /* pulldown menu options for loan periods*/
      "loanRule" : "3 hours" /* defaut select value for <option> value*/
    },
    targetUrl : "https://watzek.lclark.edu/src/prod/reservesRequest2020.php", /* URL to send data to, for emailing, etc.*/
    successMessage : "<md-card style='background-color:#e6e6e6;'><md-card-content><p>Your request has been placed. Watzek Library Access Services staff will aim to place the item on reserve within 24 hours. Items that are checked out will be recalled and placed on reserves as soon as possible. If you have questions, please email reserves@lclark.edu, or contact the Service Desk at 503-768-7270.</p></md-card-content></md-card>",
    failureMessage : "<md-card style='background-color:#e6e6e6;'><md-card-content><p>We're sorry, an error occurred. Please let us know at reserves@lclark.edu, or contact the Service Desk at 503-768-7270.</p></md-card-content></md-card>",
    primoDomain : "primo.lclark.edu",
    primoVid : "LCC",
    primoScope : "lcc_local"
  })
  .component('reservesRequest',{
    bindings: { parentCtrl: '<' },
    template: '<div ng-init="checkFormVals()" ng-click="isReplyFormOpen = !isReplyFormOpen" ng-show=\'{{displayRequestLink}}\' style=\'margin-bottom:10px;\'>\n    <span style=\'color: #883300;font-weight: bold;font-size: 100%;font-size:15px;margin-left: 10px;margin-right:15px;\'>COURSE RESERVES: </span>\n    <a     style=\'font-weight: bold;\n    font-size: 100%;\n    color: #1c62a8;\n    padding: 5px 7px;\n    -moz-border-radius: 1em;\n    border-radius: 1em;\n    line-height: 1.3em;\n    background: #f5f5f5;\n    border: solid 1px #ddd;\n    height: 30px;\n    margin-left: 5px;\n    margin-right: 5px;\'\'>Place on Reserve</a></div>\n\n     <md-card style=\'background-color:#e6e6e6;margin-bottom:50px;\' ng-init="isReplyFormOpen = false" ng-show="isReplyFormOpen" id="replyForm">\n        <md-card-title>\n          <md-card-title-text>\n            <span class="md-headline">Place item on reserve</span>\n          </md-card-title-text>\n        </md-card-title>\n\n        <md-content md-theme="docs-dark" layout-gt-sm="row">\n\t\t\t<div layout="column" layout-padding>\n\t\t\t\t<div flex>Course: <input type=\'text\' ng-model=\'course\' style=\'border-bottom: 1px solid gray\' size=\'50\' placeholder=\'e.g. ART 101\' ng-value="course" required> </div>\n\t\t\t\t<div flex>Course Title: <input type=\'text\' ng-model=\'courseTitle\' style=\'border-bottom: 1px solid gray\' size=\'50\' placeholder=\'e.g. Intro to Art\' required></div>\n\t\t\t\t<div flex>Loan Period:  <span >\n\t\t\t\t  <select ng-model="prop.value" ng-change="showSelectValue(prop.value)" ng-options="v for v in prop.values">\n\t\t\t\t  </select>\n\t\t\t\t</span>\n\t\t\t\t</div>\n        <div flex>Comments: <textarea ng-model=\'comments\'></textarea></div>\n\t\t\t</div>\n\n         </md-content>\n        <md-card-actions layout="row" layout-align="left center">\n          <md-button ng-click=\'submitRequest(mySelect)\' class="rreq md-raised">Place item on reserve</md-button>\n\n        </md-card-actions>\n      </md-card>',
    controller:
      function reservesRequestController($scope, $http, $element, dataService, $mdDialog, reserveRequestOptions){
        console.log($scope);

        var formatDenyList = reserveRequestOptions.formatDenyList;
        $scope.instCode=reserveRequestOptions.instCode;
        $scope.primoDomain=reserveRequestOptions.primoDomain;
        $scope.primoVid=reserveRequestOptions.primoVid;
        $scope.primoScope=reserveRequestOptions.primoScope;
        $scope.successMessage=reserveRequestOptions.successMessage;
        $scope.failureMessage=reserveRequestOptions.failureMessage;

        this.$onInit = function () {

          var cdiCheck=dataService.isCdi($scope);
          $scope.cdiCheck=cdiCheck;

          //determines section
          var scrollId=dataService.getScrollId($scope);
          console.log(scrollId);

          // determines delivery category
          var deliveryCategory=dataService.getDeliveryCategory($scope);
          console.log(deliveryCategory);

          //hopefully this is effective- displays in 'view it' for print, 'get it' for electronic
          if(deliveryCategory=="Alma-P"){var scrollIdMatch="getit_link1_0";}
          else{var scrollIdMatch="getit_link2";}

          $scope.displayRequestLink = false;
          $scope.required = true;
          $scope.format = dataService.getFormat($scope);
          console.log($scope.format);
          if($scope.format=="video"){
            $scope.displayDigitize=true;
            $scope.displayDatepicker=true;
            $scope.button1text="Add to Course Reserves";
            $scope.button2text="Submit";

          }
          else{
            $scope.button1text="Add to Course Reserves";
            $scope.button2text="Submit";

          }

          var formatCheck = formatDenyList.indexOf($scope.format);
          if (formatCheck >= 0) {
            var okFormat = false;
          } else {
            var okFormat = true;
          }

          var userGroup = dataService.getUserGroup($scope);
          if($scope.cdiCheck==false){var valid = dataService.doesLibraryOwn($scope);}
          var userGroupAllowedlist=reserveRequestOptions.userGroupAllowedlist;
          var userCheck = userGroupAllowedlist.indexOf(userGroup);

          if ((userCheck >= 0 && valid == true && okFormat == true && scrollId==scrollIdMatch) || (userCheck>=0 && $scope.cdiCheck==true && okFormat==true && scrollId==scrollIdMatch)) {

            $scope.displayRequestLink = true;
            $scope.instructor = dataService.getInstructor($scope);
            $scope.delCat = dataService.getDeliveryCategory($scope);
            $scope.prop=reserveRequestOptions.selectProps;
            $scope.loanRule=reserveRequestOptions.selectProps.loanRule;

          }

        };
        $scope.showSelectValue = function (mySelect) {
          console.log(mySelect);
          $scope.loanRule = mySelect;
        };

        $scope.checkFormVals = function() {
          if (sessionStorage.course && sessionStorage.course !="undefined"){$scope.course = sessionStorage.course;};
          if (sessionStorage.courseTitle && sessionStorage.courseTitle !="undefined"){$scope.courseTitle = sessionStorage.courseTitle;};

        }

        $scope.submitRequest = function () {
          sessionStorage.course=$scope.course;
          sessionStorage.courseTitle=$scope.courseTitle;
          //console.log("request");
          $scope.title = dataService.getTitle($scope);
          $scope.author = dataService.getAuthor($scope);
          if($scope.cdiCheck==false){$scope.callNumber = dataService.getCallNumber($scope);}
          else{$scope.callNumber="N/A";}
          if($scope.cdiCheck==false){$scope.location = dataService.getLocation($scope);}
          else{$scope.location="N/A";}
          $scope.url = dataService.getUrl($scope);
          if($scope.cdiCheck==false){$scope.availability = dataService.getAvailability($scope);}
          else{$scope.availability="Electronic record";}

          //console.log($scope);
          //console.log($element);
          var title = $scope.title;
          var req = {
            method: 'POST',
            url: reserveRequestOptions.targetUrl,
            headers: {
              'Content-Type': undefined
            },
            data: {
              title: $scope.title,
              loanRule: $scope.loanRule,
              callNumber: $scope.callNumber,
              instructor: $scope.instructor,
              author: $scope.author,
              course: $scope.course,
              courseTitle: $scope.courseTitle,
              location: $scope.location,
              url: $scope.url,
              availability: $scope.availability,
              comments: $scope.comments,
              digitize: $scope.digitize,
              myDate: $scope.myDate

            }
          };

          $http(req).then(function successCallback(response) {
            $element.find('md-card').html($scope.successMessage);
            // this callback will be called asynchronously
            // when the response is available
          }, function errorCallback(response) {

            $element.find('md-card').html($scope.failureMessage);
          });
        };

      }
  })
  .factory('dataService', ['$http', function ($http) {
    return {
      getMMSid: function getMMSid($scope) {
        var mms = $scope.$parent.$parent.$parent.$ctrl.item.pnx.display.lds04;
        //console.log("MMSID: "+mms);
        for (var i = 0; i < mms.length; i++) {
          //console.log(mms[i]);
          var pieces = mms[i].split("$$I");
          if (pieces[1] == $scope.instCode) {
            var mmsid = pieces[0];
            $scope.mmsid = mmsid;
          }
        }
        return mmsid;
      },
      isCdi: function isCdi($scope){

        var pnx= $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx;
        var recordid=pnx.control.recordid[0];
        var pieces = recordid.split("_");
        var verdict=pieces.includes("cdi");
        return verdict;

      },
      getDeliveryCategory: function getDeliveryCategory($scope){
        var deliveryCategory=$scope.$parent.$parent.$parent.$parent.$ctrl.item.delivery.deliveryCategory[0];
        console.log($scope.$parent.$parent.$parent.$parent.$ctrl.item);
        return deliveryCategory;

      },
      doesLibraryOwn: function doesLibraryOwn($scope) {
        console.log($scope.$parent.$parent.$ctrl.locationServices);
        var insts = $scope.$parent.$parent.$ctrl.locationServices.itemInfo.locations[0].organization;
        // $scope.instcode=["01ALLIANCE_LCC"]

        var check = insts.indexOf($scope.instCode);
        console.log(check);
        var second = $scope.$parent.$parent.$ctrl.item.pnx.browse.institution;
        var check2 = second.indexOf($scope.instCode);
        console.log(check2);
        if (check == "-1" && check2 == "-1") {
          return false;
        } else {
          return true;
        }
      },
      getCallNumber: function getCallNumber($scope) {
        // var calls=$scope.$root.$$childHead.$$childHead.$$childHead.$$childHead.$ctrl.fullViewPageService._currentItem.pnx.browse.callnumber;
        if ($scope.delCat == "Alma-E") {
          var callNumber = "N/A";
        } else {
          var calls = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.browse.callnumber;
          for (var i = 0; i < calls.length; i++) {
            var parts = calls[i].split("$$");
            console.log("parts:")
            console.log(parts);
            var partCheck="I"+$scope.instCode;
            if (parts[1] == partCheck) {
              var callNumber = parts[2].substring(1);
              console.log("exception");
            }
          }
        }

        return callNumber;
      },
      getTitle: function getTitle($scope) {
        var title = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.addata.btitle[0];
        return title;
      },
      getAuthor: function getAuthor($scope) {

        var obj = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.addata;
        if (obj.hasOwnProperty("aulast")) {
          var author = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.addata.aulast[0];
        } else {
          var author = "N/A";
        }
        return author;
      },
      getFormat: function getFormat($scope) {

        console.log($scope);
        var format = $scope.$parent.$parent.$ctrl.item.pnx.display.type[0];
        console.log("Format: "+format)
        return format;
      },
      getDeliveryCategory: function getDeliveryCategory($scope) {
        var delCat = $scope.$parent.$parent.$parent.$parent.$ctrl.item.delivery.deliveryCategory[0];
        return delCat;
      },
      getLocation: function getLocation($scope) {

        if ($scope.delCat == "Alma-E") {
          var location = "Electronic Resource";
        } else {
          var mainLocation = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.delivery.bestlocation.mainLocation;
          var subLocation = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.delivery.bestlocation.subLocation;

          var location = mainLocation + " " + subLocation;
        }
        console.log(location.length);
        if (location.length==0){location="N/A";}
        return location;
      },
      getUrl: function getUrl($scope) {

        if($scope.cdiCheck==false){var context="L";}
        else{var context="PC";}


        var docid = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.control.recordid[0];
        var url = "http://"+ $scope.primoDomain+"/primo-explore/fulldisplay?docid=" + docid + "&context="+context+"&vid="+$scope.primoVid+"&search_scope="+$scope.primoScope+"&tab=default_tab&lang=en_US";
        return url;
      },
      getAvailability: function getAvailability($scope) {
        if ($scope.delCat == "Alma-E") {
          var availability = "Electronic";
        } else {
          var availability = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.delivery.bestlocation.availabilityStatus;
        }
        return availability;
      },
      getInstructor: function getInstructor($scope) {
        var rootScope = $scope.$root;
        var uSMS = rootScope.$$childHead.$ctrl.userSessionManagerService;
        var jwtData = uSMS.jwtUtilService.getDecodedToken();
        console.log(jwtData);
        var instructor = jwtData.userName;
        return instructor;
      },
      getScrollId: function getScrollId($scope){

        console.log($scope);
        var scrollId=$scope.$parent.$parent.$parent.$ctrl.serviceScrollId;
        console.log("scrollID: "+scrollId)
        return scrollId;
      },
      getUserGroup: function getUserGroup($scope) {

        var rootScope = $scope.$root;
        var uSMS = rootScope.$$childHead.$ctrl.userSessionManagerService;
        var jwtData = uSMS.jwtUtilService.getDecodedToken();
        console.log(jwtData);
        var userGroup = jwtData.userGroup;
        return userGroup;
      }
    };
  }]);


/***************************** end reserves request ***************************/


  angular
    .module('customizationTwo', [])
    .component('customizationTwo',{
      template: '<p>second customization!</p>'
    });




/****************************  begin libraryHUD  *****************************/


    angular.module('libraryHUD', []).component('libraryHud', {
      template: '\n    <md-card ng-repeat="library in libraries" class="default-card" flex>\n        <img ng-src="{{ library.img }}" class="md-card-image" alt="image caption">\n        <md-card-title>\n            <md-card-title-text>\n                <span class="md-headline">{{ library.name }}</span>\n                <span ng-if="library.hours" class="md-title">{{ library.hours }}</span>\n                <span ng-if="!library.hours" class="md-title"><a href="{{ library.hours_link.url }}">Click here for hours</a></span>\n            </md-card-title-text>\n        </md-card-title>\n        <md-card-content>\n            <p ng-if="library.email">Contact email: <a ng-href="mailto:{{library.email }}">{{ library.email }}</a></p>\n            <p ng-if="library.phone">Contact phone: <a ng-href="tel:{{library.phone }}">{{ library.phone }}</a></p>\n        </md-card-content>\n        <md-card-actions ng-if="library.links" layout="row">\n            <div ng-repeat="link in library.links">\n                <a ng-href="{{ link.url }}">\n                    <md-button>{{ link.name }}</md-button>\n                </a>\n            </div>\n        </md-card-actions>\n    </md-card>\n    ',
      controller: ['$scope', 'HUDService', 'HUDLibraries', function ($scope, HUDService, HUDLibraries) {
        $scope.libraries = HUDLibraries;
        $scope.libraries.map(function (library) {
          return HUDService.getHours(library).then(function (hours) {
            return library.hours = hours;
          });
        });
      }]
    }).factory('HUDService', ['$http', function ($http) {
      return {
        /**
         * Fetches the current operating hours for a library.
         * @param  {object} library  library object from config
         * @return {promise}         description of hours, or false if not fetched
         */
        getHours: function getHours(library) {
          if (library.hours_link && library.hours_link.type === 'gcal') {
            return $http.get(library.hours_link.url).then(function (response) {
              return "Today's Hours: " + response.data.items.slice(-1)[0].summary;
              //return "Today's Hours: " + response.data.items[0].summary;
              //return "Today's Hours: Closed"

            });
          } else if(library.hours_link && library.hours_link.type === 'alma'){
            return $http.get(library.hours_link.url).then(function (response) {
              //data=JSON.parse(data);
              console.log(response.data.day[0]);
              var today=response.data.day[0];
              var hrs=today.hour;
              console.log(hrs);


              var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
              var thisday  = new Date();
              var tdate= thisday.toLocaleDateString("en-US", options);
              //tdate=getTextDate();
              if(hrs.length==0){
                var hours="Today's Hours: Closed"
              }
              else{
                 var open=hrs[0].from;
                 var close=hrs[0].to;
                 switch(true){
                   case (open=="00:00" && close=="23:59"):
                   var hours="Today's Hours: Open 24 Hours";
                   break;

                   case (open=="00:00" && close !="23:59"):
                   var cl=convertDate(close)
                   var hours="Today's Hours: Close at "+cl;
                   break;

                   case (open !="00:00" && close=="23:59"):
                   var op=convertDate(open);
                   var hours="Today's Hours: Open at "+op;
                   break;

                   default:
                   var op=convertDate(open)  //custom fx to convert 24hr to 12hr
                   var cl=convertDate(close)
                   var hours="Today's Hours: "+op+"-"+cl;

                 }
              }



              return hours;
              //return "Today's Hours: Closed"


              // function inside function, which is dumb
              function convertDate(military){
                var time = military.split(':'); // convert to array
                // fetch
                var hours = Number(time[0]);
                var minutes = Number(time[1]);

                // calculate
                var timeValue;

                if (hours > 0 && hours <= 12) {
                  timeValue= "" + hours;
                } else if (hours > 12) {
                  timeValue= "" + (hours - 12);
                } else if (hours == 0) {
                  timeValue= "12";
                }
                timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
                timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM
                return timeValue;
              }
              /* end convertdate*/

            });

          }

          else return new Promise(function () {
            return "Today's Hours: Closed"
            //return false;
          });
        }
      };
    }]).run(function ($http) {
      // Necessary for requests to succeed...not sure why
      $http.defaults.headers.common = { 'X-From-ExL-API-Gateway': undefined };
    });

    app.constant('HUDLibraries', [{
      name: "Aubrey R. Watzek Library",
      email: "librarian@lclark.edu",
      phone: "503-768-7285",
      img: "https://primo.lclark.edu/primo-explore/custom/LCC/img/test-header.jpg",
      hours_link: {
        "type": "alma",
        "url": "https://watzek.lclark.edu/src/prod/getAlmaHours.php"
      },
      links: [{
        "name": "Homepage",
        "url": "http://library.lclark.edu"
      }, {
        "name": "Get Help",
        "url": "http://library.lclark.edu/help"
      }]
    }, {
      name: "Paul L. Boley Law Library",
      email: "lawlib@lclark.edu",
      phone: "503-768-6676",
      img: "https://primo.lclark.edu/primo-explore/custom/LCC/img/boley-header.jpg",
      hours_link: {
        "type": "alma",
        "url": "https://watzek.lclark.edu/boleyweb/prod/getAlmaHours.php"
      },
      links: [{
        "name": "Homepage",
        "url": "http://library.lclark.edu/law"
      }, {
        "name": "Get Help",
        "url": "https://library.lclark.edu/law/askus"
      }]
    }]);
/****************************  end libraryHUD  *****************************/

})();

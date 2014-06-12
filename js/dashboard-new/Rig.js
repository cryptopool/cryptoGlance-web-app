/**

  TODO:
  - finish general structure of Rig class

**/

!function (root, $) {

  'use strict';

  /*===================================================
  =            Rig Class/Object/Constructor            =
  ===================================================*/

  var Rig = function (rigId) {
    /* Rig properties */
    this.rigId            = rigId
    this.$rigEl           = $('#rig-' + rigId)
    this.$rigNavEl        = this.$rigEl.find('.nav')
    this.$rigTabContentEl = this.$rigEl.find('.tab-content')
    this.$rigTitle        = this.$rigEl.find('h1')
    this.$rigSummary      = $('#rig-' + this.rigId + '-summary')
    this.$loader          = this.$rigSummary.find('img[alt="loading"]')
    this.manageBtn        = '<li>' +
                            '<a class="blue" href="#rig-'+ rigId +'-summary" data-toggle="tab">' +
                            'Summary ' +
                            '<i class="icon icon-dotlist"></i>' +
                            '</a>' +
                            '</li>'
    // this.$overview        = $('#overview')
    // this.$overviewTable   = this.$overview.find('.panel-body-overview div table tbody');
    // this.$rigOverviewRow  = this.$overviewTable.find('tr[data-rig="'+ rigId +'"]')
    this.$rigSummary      = $('#rig-' + rigId + '-summary').find('.panel-body-summary')
    this.deviceCollection = []
    this.enabled          = false
  }

  /*-----  End of Rig Class/Object/Constructor  ------*/


  /*==========================================
  =            Rig Public Methods            =
  ==========================================*/

  Rig.prototype.update = function (data) {
    if (!data || this.enabled && ('undefined' === typeof data.summary || 'undefined' === typeof data.devices)) {
      this._off()
      return
    }

    if (!this.enabled){
    this._on()

    this.$loader.remove()

    this.$rigNavEl.append(this.manageBtn)
  }

    var stats = ''
    var summary = data.summary || {}
    var devices = data.devices || []
    var sharePercent = 0
    var totalShares = summary.accepted + summary.rejected + summary.stale
    summary.hashrate_5s = summary.hashrate_5s !== 0 ? summary.hashrate_5s : summary.hashrate_avg

    if (this.deviceCollection.length < devices.length) {
      for (var i = 0; i < (devices.length - this.deviceCollection.length); i++) {
        this.add(devices[i])
      }
    }

    this._clearNav()
    this.$rigSummary.append(this._buildStat(summary))
    // this._updateDevices(devices)

    this.$rigNavEl.find('li:eq('+ this.selectedNav +')').addClass('active')
    this.$rigTabContentEl.find('.tab-pane:eq('+ this.selectedNav +')').addClass('active')
  }

  /*-----  End of Rig Public Methods  ------*/


  /*===========================================
  =            Rig Private Methods            =
  ===========================================*/

  Rig.prototype._clearNav = function () {
    var $selectedNav = this.$rigNavEl.find('.active')
    this.selectedNav = $selectedNav[0] ? $selectedNav.index() : 0
    this.$rigNavEl.find('li').remove()
  }

  Rig.prototype._buildStat = function (statusObj) {
    var statusHtml = ''
    for (var key in statusObj) {
      switch (key) {
        case 'accepted':
          statusHtml += this._buildStatHtml(key, statusObj[key], 'success', ((statusObj[key]/totalShares) * 100).toFixed(0))
          break
        case 'rejected':
        case 'stale':
          statusHtml += this._buildStatHtml(key, statusObj[key], 'danger', ((statusObj[key]/totalShares) * 100).toFixed(0))
          break
        case 'hashrate_5s':
          // hashrateCollection[this.rigId] = statusObj[key]
        case 'hashrate_avg':
          statusHtml += this._buildStatHtml(key, Util.getSpeed(statusObj[key]), null, null)
          break
        default:
          statusHtml += this._buildStatHtml(key, statusObj[key], null, null)
      }
    }
    return statusHtml
  }
  Rig.prototype._buildStatHtml = function (name, value, progress, share) {
    return '<div class="stat-pair">' +
            '<div class="stat-value">' + value + '</div>' +
            '<div class="stat-label">' + name.replace(/_|-|\./g, ' ') + '</div>' +
            '<div class="progress progress-striped">' +
            '<div class="progress-bar progress-bar-' + progress + '" style="width: ' + share +'%">' +
            '</div>' +
            '</div>' +
            '</div>'
  }

  Rig.prototype.add = function(deviceObj) {
    this.deviceCollection.push(new Device(deviceObj))
  };

  Rig.prototype._off = function () {
    this.enabled = false
    this.$rigEl.find('.toggle-panel-body, .panel-footer').hide()
    this.$rigNavEl.hide()
    this.$rigTabContentEl.hide()

    // if (this.$rigOverviewRow.length == 0) {
    //   $this.overviewTable.append('<tr data-rig="'+ this.rigId +'"></tr>')
    // }
    // this.$rigOverviewRow.html('<tr data-rig="'+ this.rigId +'">' +
    //                           '<td><i class="icon icon-ban-circle grey"></i></td>' +
    //                           '<td><a href="#rig-'+ this.rigId +'" class="anchor-offset rig-'+ this.rigId +' grey">'+ this.$rigTitle.html().replace(' - OFFLINE', '') +'</a></td>' +
    //                           '<td>--</td>' +
    //                           '<td>--</td>' +
    //                           '<td>--</td>' +
    //                           '</tr>')

    this.$rigEl.removeClass('panel-warning panel-danger').addClass('panel-offline')
    this.$rigEl.find('.btn-manage-rig').hide()
  }

  Rig.prototype._on = function() {
    this.enabled = true
    this.$rigEl.find('.toggle-panel-body, .panel-footer').show()
    this.$rigNavEl.show()
    this.$rigTabContentEl.show()
    this.$rigEl.removeClass('panel-offline')
    this.$rigEl.find('.btn-manage-rig').show()
  }

  /*-----  End of Rig Private Methods  ------*/


  /*==================================
  =            Rig Export            =
  ==================================*/

  root.Rig = Rig

  /*-----  End of Rig Export  ------*/

}(window, window.jQuery)

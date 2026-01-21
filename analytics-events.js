/* analytics-events.js
   Comprehensive event tracking for Windows download funnel
   Tracks: impressions, clicks, hovers, help interactions, install status
*/
(function(){
  const AnalyticsEvents = {
    
    sessionId: null,
    userId: null,
    pageStartTime: Date.now(),
    downloadClicked: false,
    installHelpOpened: false,

    init: function(){
      this.sessionId = this.generateSessionId();
      this.userId = this.getUserId();
      this.attachListeners();
      this.trackPageView();
    },

    generateSessionId: function(){
      return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2,9);
    },

    getUserId: function(){
      let userId = localStorage.getItem('wdw_user_id');
      if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2,9);
        localStorage.setItem('wdw_user_id', userId);
      }
      return userId;
    },

    attachListeners: function(){
      // Download button clicks
      document.addEventListener('click', (e) => {
        if (e.target.closest('[download]') || e.target.closest('.download-btn')) {
          this.trackEvent('download_click', {
            element: e.target.textContent?.trim(),
            timestamp: new Date().toISOString()
          });
          this.downloadClicked = true;
        }
      });

      // Download button hovers
      document.addEventListener('mouseover', (e) => {
        if (e.target.closest('[download]') || e.target.closest('.download-btn')) {
          this.trackEvent('download_hover', {
            element: e.target.textContent?.trim()
          });
        }
      });

      // Install help modal opens
      window.WDWInstallHelpModal && document.addEventListener('click', (e) => {
        if (e.target.closest('[data-install-help]')) {
          window.WDWInstallHelpModal.open();
          this.installHelpOpened = true;
        }
      });

      // Page scroll depth
      this.trackScrollDepth();

      // Unload: track session duration & engagement
      window.addEventListener('beforeunload', () => {
        const duration = Math.round((Date.now() - this.pageStartTime) / 1000);
        this.trackEvent('page_session_complete', {
          duration_seconds: duration,
          download_clicked: this.downloadClicked,
          install_help_opened: this.installHelpOpened,
          scroll_depth: this.getScrollDepth()
        });
      });
    },

    trackPageView: function(){
      this.trackEvent('page_view', {
        url: window.location.pathname,
        title: document.title,
        os: this.getOS()
      });
    },

    trackScrollDepth: function(){
      let maxScroll = 0;
      window.addEventListener('scroll', () => {
        const depth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        if (depth > maxScroll) {
          maxScroll = depth;
          if (depth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
            this.trackEvent('scroll_depth', {depth_percent: depth});
          }
        }
      });
    },

    getScrollDepth: function(){
      return Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    },

    trackEvent: function(name, payload){
      const fullPayload = Object.assign({
        session_id: this.sessionId,
        user_id: this.userId,
        os: this.getOS(),
        timestamp: new Date().toISOString()
      }, payload || {});

      try {
        if (window.gtag) {
          window.gtag('event', name, fullPayload);
        } else {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push(Object.assign({event: name}, fullPayload));
        }
      } catch(e) {
        console.warn('Analytics event failed:', e);
      }

      // Optional: send to custom endpoint
      if (this.customEndpoint) {
        this.sendToEndpoint(name, fullPayload);
      }
    },

    sendToEndpoint: function(eventName, payload){
      fetch(this.customEndpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({event: eventName, data: payload})
      }).catch(e => console.warn('Custom endpoint failed:', e));
    },

    getOS: function(){
      const ua = navigator.userAgent;
      if (/Windows NT|Win64|WOW64|Windows/.test(ua)) return 'Windows';
      if (/Mac/.test(ua)) return 'macOS';
      if (/X11|Linux/.test(ua)) return 'Linux';
      return 'Other';
    },

    // Funnel tracking
    trackFunnel: function(step, metadata){
      this.trackEvent('download_funnel', Object.assign({
        step: step,
        // step values: 'page_view', 'cta_visible', 'cta_click', 'download_started', 'install_help_opened'
      }, metadata || {}));
    }
  };

  window.WDWAnalyticsEvents = AnalyticsEvents;

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AnalyticsEvents.init());
  } else {
    AnalyticsEvents.init();
  }

})();

/* ab-test-manager.js
   A/B Test manager with statistical significance checking
   Stores variants in localStorage, sends events to GA4/dataLayer
*/
(function(){
  const ABTestManager = {
    storage: 'wdw_ab_tests',
    
    config: {
      /* Example A/B test variant:
      'cta-color': {
        active: true,
        variants: ['blue', 'green'],
        weights: [50, 50],
        conversionEvent: 'download_click'
      }
      */
    },

    init: function(testConfig){
      this.config = Object.assign(this.config, testConfig);
      this.assignVariants();
      this.trackImpression();
    },

    assignVariants: function(){
      const tests = JSON.parse(localStorage.getItem(this.storage) || '{}');
      Object.keys(this.config).forEach(testName => {
        if (tests[testName]) return; // already assigned
        
        const test = this.config[testName];
        if (!test.active) return;
        
        const rand = Math.random() * 100;
        let cumWeight = 0;
        let assigned = test.variants[0];
        
        for (let i = 0; i < test.variants.length; i++){
          cumWeight += test.weights[i];
          if (rand <= cumWeight){
            assigned = test.variants[i];
            break;
          }
        }
        
        tests[testName] = assigned;
      });
      localStorage.setItem(this.storage, JSON.stringify(tests));
    },

    getVariant: function(testName){
      const tests = JSON.parse(localStorage.getItem(this.storage) || '{}');
      return tests[testName] || this.config[testName]?.variants[0];
    },

    trackImpression: function(){
      const tests = JSON.parse(localStorage.getItem(this.storage) || '{}');
      Object.keys(tests).forEach(testName => {
        if (!this.config[testName]?.active) return;
        this.sendEvent('ab_test_impression', {
          test: testName,
          variant: tests[testName],
          url: window.location.pathname
        });
      });
    },

    trackConversion: function(testName, eventName){
      const variant = this.getVariant(testName);
      this.sendEvent(eventName || 'ab_test_conversion', {
        test: testName,
        variant: variant,
        timestamp: new Date().toISOString()
      });
    },

    sendEvent: function(name, payload){
      try{
        if (window.gtag) {
          window.gtag('event', name, payload || {});
        } else {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push(Object.assign({event: name}, payload || {}));
        }
      }catch(e){console.warn('ab-test event failed:', e)}
    }
  };

  // Expose globally
  window.WDWABTestManager = ABTestManager;

})();

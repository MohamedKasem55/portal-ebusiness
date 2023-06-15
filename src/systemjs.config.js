/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({ meta: {
    'xlsx': {
      exports: 'XLSX' // <-- tell SystemJS to expose the XLSX variable
    }
  },
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/',
      '*': 'node_modules/*',
      'app/*': 'app/*'
    },
    packageConfigPaths: ['node_modules/*/package.json'],
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',

      // angular bundles
      'xlsx': 'npm:@xlsx/dist/xlsx.full.min.js', 
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      '@angular/upgrade': 'npm:@angular/upgrade/bundles/upgrade.umd.js',

      // other libraries
      'rxjs':                      'npm:rxjs/bumdles/rxjs.umd.min.js',
    
	   'ng2-simple-mq': 'npm:ng2-simple-mq/bundle/ng2-simple-mq.umd.min.js',
      'moment': 'npm:moment',
      '@ngx-translate/core': 'npm:@ngx-translate/core/bundles/ngx-translate-core.umd.min.js',
      '@ngx-translate/http-loader': 'npm:@ngx-translate/core/bundles/ngx-translate-http-loader.umd.min.js',
      '@ngx-config/core': 'npm:@ngx-translate/core/bundles/ngx-config-core.umd.min.js',
      '@ngx-config/http-loader': 'npm:@ngx-translate/core/bundles/ngx-config-http-loader.umd.min.js',
     '@swimlane/ngx-datatable': 'npm:@swimlane/ngx-datatable/bundles/swimlane-ngx-datatable.umd.min.js',
      'ngx-order-pipe': 'npm:ngx-order-pipe/bundles/ngx-order-pipe.umd.min.js',
      'ngx-webstorage': 'npm:ngx-webstorage/bundles/ngx-webstorage.umd.min.js',
     '@ngx-config/http-loader': 'npm:@ngx-config/http-loader/bundles/http-loader.umd.min.js',
     '@ng-bootstrap/ng-bootstrap': 'npm:@ng-bootstrap/ng-bootstrap/bundles/ng-bootstrap.umd.min.js',
     'ngx-bootstrap': 'npm:ngx-bootstrap/bundles/ngx-bootstrap.umd.min.js',
     'file-saver': 'npm:file-saver/FileSaver.min.js',
     '@ng-select/ng-select': 'npm:@ng-select/ng-select/bundles/ng-select.umd.js',
     'ngx-iban': 'npm:ngx-iban/bundles/ngx-iban.umd.js',
     '@ngneat/until-destroy': 'npm:@ngneat/until-destroy/bundles/ngneat-until-destroy.umd.min.js'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      },
  
   
      'ngx-order-pipe': { defaultExtension: 'js' }
    }
  });
})(this);

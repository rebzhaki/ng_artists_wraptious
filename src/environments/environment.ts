// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const SERVER_BASE_URL = 'https://dorothy2.wraptious.com';
const SERVER_BASE_URL_2 = 'https://etheredge2.wraptious.com';

export const environment = {
  app_version: 'dev',
  cookie_domain_value: 'localhost',
  captchaSiteKey: '6LdLZwYjAAAAAHU6-Ofpwb8pNT24iyrhjCuGh3Tt',
  api_base_url: `${SERVER_BASE_URL}/api/v0.1`,
  log_url: `${SERVER_BASE_URL}/core/log/app`,
  server_base_url: SERVER_BASE_URL,
  image_server_url: `${SERVER_BASE_URL}/img/images`,
  image_inspector_url: `${SERVER_BASE_URL}/img/inspect`,
  image_proof_url: `${SERVER_BASE_URL_2}/img/etheredge/products`,
  bespoke_url: 'https://about.wraptious.com/bespoke.html',
  // facebookAuthUrl: 'https://www.facebook.com/v12.0/dialog/oauth?',
  // facebookAuthUrl: 'http://localhost:3000/facebook',
  // facebookAuthUrlRedirect: 'http://localhost:3000/facebook/auth-status',
  facebookAppID: '265067671839027',
  googleAuthUrl: 'http://localhost:3000/google',
  googleAuthUrlRedirect: 'http://localhost:3000/google/auth-status',
  googleAppID:
    '848584471950-ob99ek13alkns1ab7d67hlouvnknamqr.apps.googleusercontent.com',
  googleAnalyticsTrackingId: 'G-M9L4B3FJK6',
  googleAnalyticsTagId: 'GTM-K7FDNMK',
  fbPixelId: '790164984441571',

  production: false,
  ngrx_logs: true,
  enable_router_tracing: true,
  client_id: 'ArtistStagingApp',
  delay: 5, // throttle requests
  artMaxFileSizeLimit: '30MB',
  artMinFileSizeLimit: '4KB',
  artUploadQuality: 95, // JPEG Image quality at which to upload files.
  artMinimum_x: 650,
  artMinimum_y: 650,
  competitionArtMinimum_x: 1200,
  competitionArtMinimum_y: 1200,
  artMaximum_x: 10000,
  artMaximum_y: 10000,
  loadSignUpPage: true,
  displaySSOSignUp: true,

  aspect_ratio_fuzziness: 0.1,

  enable_master_image_override: true,

  /* IS (Image Server) URL Settings  */
  is_default_retrieval_strategy: 'lb', // if prioritising s3, it's rlb
  is_quick_retrieval_strategy: 'lbilb', // if prioritising s3, it's rlbirlb
  is_accurate_retrieval_strategy: 'dlbidlb', // if prioritising s3, it's drlbidrlb
  is_force_image_rebuild_retrieval_strategy: 'bib', // can only be this, under any circumstances.
  isTesting: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

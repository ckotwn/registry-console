const environments = {
  prod: {
    gbifUrl: '//www.gbif.org',
    dataApi: '//registry-api.gbif.org',
    dataApi_v1: '//api.gbif.org/v1',
    secretariatNode: '02c40d2a-1cba-4633-90b7-e36e5e97aba8',
    languages: [{ key: 'en', code: '🇬🇧', name: 'English' }]
  },
  uat: {
    gbifUrl: '//www.gbif-uat.org',
    dataApi: '//registry-api.gbif-uat.org',
    dataApi_v1: '//api.gbif-uat.org/v1',
    secretariatNode: '02c40d2a-1cba-4633-90b7-e36e5e97aba8',
    languages: [{ key: 'en', code: '🇬🇧', name: 'English' }]
  },
  dev: {
    gbifUrl: 'https://www.gbif-dev.org',
    dataApi: '//registry-api.gbif-dev.org',
    dataApi_v1: '//api.gbif-dev.org/v1',
    secretariatNode: '02c40d2a-1cba-4633-90b7-e36e5e97aba8',
    env: 'dev',
    languages: [
      { key: 'en', code: '🇬🇧', name: 'English' },
      { key: 'he', code: 'HE', name: 'Hebrew' },
      { key: 'kk', code: '🇰🇿', name: 'Қазақша' },
      { key: 'da', code: '🇩🇰', name: 'Dansk' }
    ]
  },
  demo: {
    gbifUrl: 'https://www.gbif-dev.org',
    dataApi: 'https://registry-demo.gbif-dev.org',
    dataApi_v1: '//api.gbif.org/v1',
    secretariatNode: '02c40d2a-1cba-4633-90b7-e36e5e97aba8',
    env: 'dev',
    languages: [
      { key: 'en', code: '🇬🇧', name: 'English' },
      { key: 'he', code: 'HE', name: 'Hebrew' },
      { key: 'kk', code: '🇰🇿', name: 'Қазақша' },
      { key: 'da', code: '🇩🇰', name: 'Dansk' }
    ]
  }
};

const domain = window.location.hostname;

let env = environments.demo;
if (domain.endsWith('gbif.org')) {
  env = environments.prod;
} else if (domain.endsWith('gbif-uat.org')) {
  env = environments.uat;
} else if (domain.endsWith('gbif-dev.org')) {
  env = environments.dev;
}

export default env;
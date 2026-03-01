import JWTGuide from '@pages/jwt-deep-dive.jsx';
import OAuthGuide from '@pages/oauth2-oidc-guide.jsx';
import KerberosGuide from '@pages/kerberos.jsx';

const pagesConfig = [
  {
    id: 'jwt-deep-dive',
    path: '/jwt-deep-dive',
    title: 'JWT Deep Dive',
    subtitle: 'Structure, Signing, Claims & GCP Federation Mapping',
    icon: '\u{1F510}',
    color: '#3b82f6',
    category: 'Tokens',
    component: JWTGuide,
  },
  {
    id: 'oauth2-oidc',
    path: '/oauth2-oidc',
    title: 'OAuth2, OIDC & SSO',
    subtitle: 'Protocols, Grant Types, Tokens & How They Connect',
    icon: '\u{1F513}',
    color: '#8b5cf6',
    category: 'Protocols',
    component: OAuthGuide,
  },
  {
    id: 'kerberos',
    path: '/kerberos',
    title: 'Kerberos',
    subtitle: 'The Classic Network Authentication Protocol',
    icon: '\u{1F512}',
    color: '#059669',
    category: 'Protocols',
    component: KerberosGuide,
  },
];

export default pagesConfig;

import JWTGuide from '@pages/jwt-deep-dive.jsx';
import OAuthGuide from '@pages/oauth2-oidc-guide.jsx';
import KerberosGuide from '@pages/kerberos.jsx';
import ADGuide from '@pages/active-directory.jsx';
import SessionCookiesGuide from '@pages/session-cookies.jsx';
import ADACLGuide from '@pages/ad-acl.jsx';
import KafkaGuide from '@pages/kafka.jsx';
import TLSFlowGuide from '@pages/ldaps_https.jsx';
import GCPSecurityGuide from '@pages/gcp-security.jsx';
import NTLMGuide from '@pages/ntlm.jsx';
import PKIGuide from '@pages/pki.jsx';

const pagesConfig = [
  {
    id: 'jwt-deep-dive',
    path: '/jwt-deep-dive',
    title: 'JWT Deep Dive',
    subtitle: 'Structure, Signing, Claims & GCP Federation Mapping',
    icon: '\u{1F510}',
    color: '#3b82f6',
    category: 'Concepts',
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
  {
    id: 'active-directory',
    path: '/active-directory',
    title: 'Active Directory',
    subtitle: 'Domain Controllers, FSMO, Trusts & AD Architecture',
    icon: '\u{1F3F0}',
    color: '#0ea5e9',
    category: 'Directory Services',
    component: ADGuide,
  },
  {
    id: 'session-cookies',
    path: '/session-cookies',
    title: 'Sessions & Cookies',
    subtitle: 'HTTP State, Storage, Signing, Encryption & Security',
    icon: '\u{1F36A}',
    color: '#f59e0b',
    category: 'Concepts',
    component: SessionCookiesGuide,
  },
  {
    id: 'ad-acl',
    path: '/ad-acl',
    title: 'AD Access Control',
    subtitle: 'Security Descriptors, DACLs, Inheritance & ACE Evaluation',
    icon: '\u{1F6E1}',
    color: '#dc2626',
    category: 'Directory Services',
    component: ADACLGuide,
  },
  {
    id: 'tls-flow',
    path: '/tls-flow',
    title: 'LDAPS & HTTPS TLS Flow',
    subtitle: 'TLS Handshake Sequences — LDAPS vs HTTPS vs TLS 1.2 vs 1.3',
    icon: '🔐',
    color: '#38bdf8',
    category: 'Protocols',
    component: TLSFlowGuide,
  },
  {
    id: 'kafka',
    path: '/kafka',
    title: 'Apache Kafka',
    subtitle: 'Distributed Event Streaming — Topics, Brokers, Replication & ksqlDB',
    icon: '◈',
    color: '#f97316',
    category: 'Messaging & Streaming',
    component: KafkaGuide,
  },
  {
    id: 'ntlm',
    path: '/ntlm',
    title: 'NTLM Authentication',
    subtitle: 'Challenge-Response, LDAP Binds, SPNEGO, Cross-Domain & Security',
    icon: '🔐',
    color: '#6366f1',
    category: 'Protocols',
    component: NTLMGuide,
  },
  {
    id: 'pki',
    path: '/pki',
    title: 'PKI & Certificates',
    subtitle: 'Certificate Authorities, Trust Chains, CSR Flow & OpenSSL Reference',
    icon: '🏛',
    color: '#10b981',
    category: 'Protocols',
    component: PKIGuide,
  },
  {
    id: 'gcp-security',
    path: '/gcp-security',
    title: 'Google Cloud Security',
    subtitle: 'IAM Roles, Policy Binding, Cloud Identity, Workload & Workforce Federation',
    icon: '☁',
    color: '#4285f4',
    category: 'Cloud Platforms',
    component: GCPSecurityGuide,
  },
];

export default pagesConfig;

/**
 * O-A — Transport du retour /link à travers l'établissement (falsifiable).
 *
 * Ce qui est PROUVÉ ici (points d'arrêt) :
 *   • un sujet frais garde son Issuer : /link?… → /establish?next=/link?… ;
 *   • le retour est INTERNE-/link uniquement — tout le reste est refusé
 *     (open-redirect, //host, /dashboard, /linkfoo) → filet anti-détournement ;
 *   • l'imbrication ?/& survit à un aller-retour d'encodage (URLSearchParams).
 */
import { describe, it, expect } from 'vitest';
import {
  buildLinkPath,
  buildEstablishReturn,
  safeLinkReturnPath,
  buildEmissionPath,
} from './returnPath';

describe('O-A — returnPath', () => {
  describe('buildLinkPath', () => {
    it('reconstruit /link?… avec les 3 paramètres', () => {
      const p = buildLinkPath({ issuer_id: 'issuer:wts-001', redirect_uri: 'https://wts.test/cb', state: 'xyz' });
      const u = new URLSearchParams(p.split('?')[1]);
      expect(p.startsWith('/link?')).toBe(true);
      expect(u.get('issuer_id')).toBe('issuer:wts-001');
      expect(u.get('redirect_uri')).toBe('https://wts.test/cb');
      expect(u.get('state')).toBe('xyz');
    });

    it('sans paramètres → /link nu', () => {
      expect(buildLinkPath({})).toBe('/link');
    });
  });

  describe('buildEstablishReturn', () => {
    it('sujet frais AVEC issuer+redirect → /establish?next=<chemin /link>', () => {
      const dest = buildEstablishReturn({ issuer_id: 'issuer:wts-001', redirect_uri: 'https://wts.test/cb', state: 's1' });
      expect(dest.startsWith('/establish?next=')).toBe(true);
      // Le next décodé est bien le /link d'origine, state inclus (imbrication sûre).
      const next = new URLSearchParams(dest.split('?')[1]).get('next')!;
      expect(safeLinkReturnPath(next)).toBe(next);
      const inner = new URLSearchParams(next.split('?')[1]);
      expect(inner.get('issuer_id')).toBe('issuer:wts-001');
      expect(inner.get('state')).toBe('s1');
    });

    it('sans issuer OU sans redirect → /establish nu (rien à préserver)', () => {
      expect(buildEstablishReturn({})).toBe('/establish');
      expect(buildEstablishReturn({ issuer_id: 'issuer:wts-001' })).toBe('/establish');
      expect(buildEstablishReturn({ redirect_uri: 'https://wts.test/cb' })).toBe('/establish');
    });
  });

  describe('safeLinkReturnPath — le filet anti-détournement', () => {
    it('accepte /link et /link?…', () => {
      expect(safeLinkReturnPath('/link')).toBe('/link');
      expect(safeLinkReturnPath('/link?issuer_id=issuer:wts-001')).toBe('/link?issuer_id=issuer:wts-001');
    });

    it('REFUSE tout ce qui n’est pas un /link interne', () => {
      for (const evil of [
        null,
        undefined,
        '',
        'https://evil.test/link',
        '//evil.test',
        '/dashboard',
        '/linkfoo',
        '/establish?next=/link',
        'javascript:alert(1)',
      ]) {
        expect(safeLinkReturnPath(evil as string)).toBeNull();
      }
    });
  });

  describe('buildEmissionPath', () => {
    it('retour /link sûr → /emission?next=/link…', () => {
      const p = buildEmissionPath('/link?issuer_id=issuer:wts-001&state=s1');
      expect(p.startsWith('/emission?next=')).toBe(true);
      expect(new URLSearchParams(p.split('?')[1]).get('next')).toBe('/link?issuer_id=issuer:wts-001&state=s1');
    });

    it('retour absent ou non /link → /emission nu (la cérémonie tourne quand même)', () => {
      expect(buildEmissionPath(null)).toBe('/emission');
      expect(buildEmissionPath('/dashboard')).toBe('/emission');
      expect(buildEmissionPath('https://evil.test')).toBe('/emission');
    });
  });
});

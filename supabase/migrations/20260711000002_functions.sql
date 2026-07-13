-- =====================================================================
-- Opus X — Sprint 1 — LOT 3 (a) : Fonctions utilitaires
-- Source d'autorité : spec figée §3.8, §5.1, §5.2
--   generate_opus_id()        → opx_ + ULID (26 car., base32 Crockford)
--   generate_unique_handle()  → slug(nom) + suffixe court, anti-collision
-- Sécurité : security definer + search_path fixé (durcissement obligatoire).
-- =====================================================================

-- ---------------------------------------------------------------------
-- ULID — 128 bits : 48 bits d'horodatage (ms) + 80 bits d'aléa
-- Encodé en base32 Crockford → 26 caractères.
-- Propriétés (§5.1) : opaque, non énumérable, trié dans le temps, permanent.
-- ---------------------------------------------------------------------
create or replace function public.generate_ulid()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  -- Alphabet Crockford base32 (exclut I, L, O, U — anti-confusion)
  alphabet constant text := '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  ts_ms    bigint;
  bits     bit(130);
  ulid     text := '';
  chunk    int;
  i        int;
begin
  ts_ms := floor(extract(epoch from clock_timestamp()) * 1000)::bigint;

  -- 130 bits = 2 bits de padding + 48 bits d'horodatage + 80 bits d'aléa
  -- (130 = 26 × 5, pour un découpage exact en 26 caractères base32)
  bits :=
      b'00'
   || substring(ts_ms::bit(64) from 17 for 48)              -- 48 bits d'horodatage
   || (floor(random() * 65536)::int)::bit(16)               -- 80 bits d'aléa
   || (floor(random() * 65536)::int)::bit(16)
   || (floor(random() * 65536)::int)::bit(16)
   || (floor(random() * 65536)::int)::bit(16)
   || (floor(random() * 65536)::int)::bit(16);

  for i in 0..25 loop
    chunk := substring(bits from (i * 5) + 1 for 5)::int;
    ulid  := ulid || substr(alphabet, chunk + 1, 1);
  end loop;

  return ulid;
end;
$$;

comment on function public.generate_ulid() is 'ULID 26 car. base32 Crockford : 48 bits ms + 80 bits aléa. Trié dans le temps, non énumérable.';

-- ---------------------------------------------------------------------
-- generate_opus_id() → opx_ + ULID
-- L'identité canonique permanente : la « signature à vie » gravée à l'émission.
-- ---------------------------------------------------------------------
create or replace function public.generate_opus_id()
returns text
language plpgsql
volatile
set search_path = ''
as $$
begin
  return 'opx_' || public.generate_ulid();
end;
$$;

comment on function public.generate_opus_id() is 'Opus ID : opx_ + ULID (§5.1). Identité canonique permanente, jamais réutilisée, découplée du handle.';

-- ---------------------------------------------------------------------
-- slugify — normalisation sans dépendance à l'extension unaccent
-- ---------------------------------------------------------------------
create or replace function public.slugify(input text)
returns text
language plpgsql
immutable
set search_path = ''
as $$
declare
  s text;
begin
  if input is null or btrim(input) = '' then
    return 'professional';
  end if;

  s := lower(btrim(input));

  -- Translittération des diacritiques les plus courants (FR/ES/PT/DE…)
  s := translate(
         s,
         'àáâãäåaèéêëìíîïòóôõöøùúûüýÿñçßæœ',
         'aaaaaaaeeeeiiiiooooooouuuuyyncsao'
       );

  -- Tout ce qui n'est pas alphanumérique devient un tiret
  s := regexp_replace(s, '[^a-z0-9]+', '-', 'g');
  -- Tirets de bord
  s := regexp_replace(s, '(^-+|-+$)', '', 'g');
  -- Longueur raisonnable pour une URL
  s := left(s, 48);
  s := regexp_replace(s, '-+$', '', 'g');

  if s = '' then
    return 'professional';
  end if;

  return s;
end;
$$;

-- ---------------------------------------------------------------------
-- generate_unique_handle(full_name)
--   slug(nom) + suffixe aléatoire court (anti-collision ET anti-énumération)
--   Boucle de ré-essai garantissant l'unicité même sous collision forcée.
-- ---------------------------------------------------------------------
create or replace function public.generate_unique_handle(full_name text)
returns text
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  alphabet constant text := '0123456789abcdefghjkmnpqrstvwxyz';  -- Crockford, minuscules (URL)
  base       text;
  suffix     text;
  candidate  text;
  attempt    int := 0;
  suffix_len int := 4;
  i          int;
begin
  base := public.slugify(full_name);

  loop
    attempt := attempt + 1;

    -- Le suffixe s'allonge si la pression de collision persiste
    if attempt > 12 then
      suffix_len := 6;
    end if;
    if attempt > 30 then
      suffix_len := 8;
    end if;

    suffix := '';
    for i in 1..suffix_len loop
      suffix := suffix || substr(alphabet, floor(random() * 32)::int + 1, 1);
    end loop;

    candidate := base || '-' || suffix;

    -- Unicité vérifiée contre la table (garantie finale : l'index UNIQUE)
    if not exists (select 1 from public.passports p where p.handle = candidate) then
      return candidate;
    end if;

    -- Filet de sécurité : jamais de boucle infinie
    if attempt >= 50 then
      return base || '-' || public.generate_ulid();
    end if;
  end loop;
end;
$$;

comment on function public.generate_unique_handle(text) is 'Handle public : slug(nom) + suffixe aléatoire (§5.2). Anti-collision (boucle) et anti-énumération. Changeable ultérieurement (301) ; l''opus_id, lui, ne change jamais.';

-- ---------------------------------------------------------------------
-- Grants minimaux (least privilege)
-- ---------------------------------------------------------------------
revoke all on function public.generate_ulid()               from public, anon, authenticated;
revoke all on function public.generate_opus_id()            from public, anon, authenticated;
revoke all on function public.generate_unique_handle(text)  from public, anon, authenticated;
revoke all on function public.slugify(text)                 from public, anon, authenticated;
-- Ces fonctions ne sont appelées que par l'émission côté serveur (Lot 4).

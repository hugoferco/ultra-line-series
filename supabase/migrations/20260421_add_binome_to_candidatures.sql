alter table candidatures
  add column if not exists prenom_binome text,
  add column if not exists nom_binome text,
  add column if not exists email_binome text,
  add column if not exists telephone_binome text;

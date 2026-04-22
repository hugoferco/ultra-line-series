-- Ajoute email participant 1, adresse binôme, et statut refus aux candidatures
ALTER TABLE candidatures ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE candidatures ADD COLUMN IF NOT EXISTS adresse_binome text;
ALTER TABLE candidatures ADD COLUMN IF NOT EXISTS refuse boolean NOT NULL DEFAULT false;

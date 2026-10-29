-- Table des projets creatifs (creee au premier demarrage du conteneur)
CREATE TABLE IF NOT EXISTS projects (
  id          VARCHAR(40) PRIMARY KEY,
  name        VARCHAR(60)  NOT NULL,
  client      VARCHAR(80)  NOT NULL,
  type        VARCHAR(20)  NOT NULL CHECK (type IN ('Branding','Video','Campagne IA','Web','Social')),
  budget      INTEGER      NOT NULL CHECK (budget BETWEEN 500 AND 1000000),
  due_date    DATE         NOT NULL,
  progress    INTEGER      NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  status      VARCHAR(12)  NOT NULL DEFAULT 'Planifie' CHECK (status IN ('En cours','Revue','Planifie','Termine')),
  team        TEXT[]       NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

INSERT INTO projects (id, name, client, type, budget, due_date, progress, status, team) VALUES
 ('p1','Refonte identite Lumen','Lumen Paris','Branding',24000,'2026-11-18',72,'En cours','{CL,MB,YA}'),
 ('p2','Spot genere IA - Hiver','Maison Arlo','Video',41500,'2026-12-02',45,'En cours','{SD,KT}'),
 ('p3','Lancement Atlas One','Atlas Mobility','Campagne IA',68000,'2026-11-07',88,'Revue','{CL,NR,PB,YA}'),
 ('p4','Site vitrine Oriel','Oriel Studio','Web',18200,'2027-01-15',12,'Planifie','{MB}'),
 ('p5','Serie TikTok Verde','Verde Cosmetics','Social',9600,'2026-10-30',100,'Termine','{KT,SD}'),
 ('p6','Packaging Nordlys','Nordlys Tea','Branding',15800,'2026-12-20',34,'En cours','{PB,NR}')
ON CONFLICT (id) DO NOTHING;

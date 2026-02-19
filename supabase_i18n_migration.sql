-- Script to add i18n columns and populate them
-- Run this in the Supabase SQL Editor

-- 1. Add new columns for English content
ALTER TABLE hermandades ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE hermandades ADD COLUMN IF NOT EXISTS titulo_completo_en TEXT;
ALTER TABLE hermandades ADD COLUMN IF NOT EXISTS pasos_en JSONB;
ALTER TABLE hermandades ADD COLUMN IF NOT EXISTS day_en TEXT;

-- 2. Update rows with English content
UPDATE hermandades SET 
  description_en = 'Sacramental of the Glorious Patriarch Saint Joseph and Brotherhood of Nazarenes of Our Father Jesus of Love in his Arrest and Mary Most Holy of the Conception. Founded: 2017. Canonical seat: Santa Ángela de la Cruz Chapel. Date: April 13.',
  titulo_completo_en = 'Sacramental of the Glorious Patriarch Saint Joseph and Brotherhood of Nazarenes of Our Father Jesus of Love in his Arrest and Mary Most Holy of the Conception',
  pasos_en = '[{"nombre":"Float of Our Father Jesus of Love in his Arrest","tunica_nazarenos":"White tail tunic and hood. Esparto sash and hazelnut-colored sandals with white socks."}]'::jsonb,
  day_en = 'Palm Sunday'
WHERE id = 75910;

UPDATE hermandades SET 
  description_en = 'Illustrious and Fervent Brotherhood and Confraternity of Nazarenes of the Triumphant Entry of Jesus into Jerusalem, From Our Father Jesus Captive and Our Mother and Lady of Tears and Saint Mary in her Immaculate Conception. Founded: 1955. Canonical seat: St. Mary''s Church. Date: April 13.',
  titulo_completo_en = 'Illustrious and Fervent Brotherhood and Confraternity of Nazarenes of the Triumphant Entry of Jesus into Jerusalem, From Our Father Jesus Captive and Our Mother and Lady of Tears and Saint Mary in her Immaculate Conception',
  pasos_en = '[{"nombre":"Float of the Entry of Jesus into Jerusalem","descripcion":"The embroidery of the skirts-vents is made by the Ecija artist Jesús Rosado Borja.","tunica_nazarenos":"Black, white cape, white hood and esparto sash.","costaleros":35}]'::jsonb,
  day_en = 'Palm Sunday'
WHERE id = 26978;

UPDATE hermandades SET 
  description_en = 'Illustrious and Fervent Brotherhood and Confraternity of Nazarenes of the Triumphant Entry of Jesus into Jerusalem, From Our Father Jesus Captive and Our Mother and Lady of Tears and Saint Mary in her Immaculate Conception. Founded: 1955. Canonical seat: St. Mary''s Church. Date: April 13.',
  titulo_completo_en = 'Illustrious and Fervent Brotherhood and Confraternity of Nazarenes of the Triumphant Entry of Jesus into Jerusalem, From Our Father Jesus Captive and Our Mother and Lady of Tears and Saint Mary in her Immaculate Conception',
  pasos_en = '[{"nombre":"Float of Our Father Jesus Captive","descripcion_imagen":"The image is by an anonymous author from the 18th century.","tunica_nazarenos":"Black, white cape, white hood and esparto sash.","costaleros":30},{"nombre":"Float of Our Lady of Tears","descripcion":"Our Lady of Tears processes on a canopy float embroidered on ''burgundy'' velvet, work of José Luis Asencio.","tunica_nazarenos":"Black, white cape, black hood and esparto sash.","costaleros":30}]'::jsonb,
  day_en = 'Palm Sunday'
WHERE id = 57188;

UPDATE hermandades SET 
  description_en = 'Fervent Brotherhood of the Most Holy Christ of the Ivy and Our Lady of Charity. Founded: 1959. Canonical seat: St. Anne''s Church. Date: April 14.',
  titulo_completo_en = 'Fervent Brotherhood of the Most Holy Christ of the Ivy and Our Lady of Charity',
  pasos_en = '[{"nombre":"Float of the Most Holy Christ of the Ivy","tunica_nazarenos":"Green tunic and hood. White cape and esparto sash knotted on the left.","costaleros":30},{"nombre":"Float of Our Lady of Charity","descripcion":"The canopy is the work of Ecija native José Luis Asencio. The mantle, in turkey blue velvet, is the work of the nuns of the Convent of Santa Isabel de Écija. The poles, in sterling silver, are from the Villarreal workshops.","tunica_nazarenos":"Green tunic and hood. White cape and esparto sash knotted on the left.","costaleros":30}]'::jsonb,
  day_en = 'Holy Monday'
WHERE id = 68445;

UPDATE hermandades SET 
  description_en = 'Brotherhood of the Most Holy Christ of Expiration, Our Lady of Sorrows and Our Father Jesus Nazarene of Mercy (Brotherhood of the Students). Founded: 1579. Canonical seat: St. James Church. Date: April 15.',
  titulo_completo_en = 'Brotherhood of the Most Holy Christ of Expiration, Our Lady of Sorrows and Our Father Jesus Nazarene of Mercy (Brotherhood of the Students)',
  pasos_en = '[{"nombre":"Float of Our Father Jesus Nazarene of Mercy","descripcion":"The basket of the float is the work of Ecija native José Luis Asencio. The skirts are from the workshop of Mariano Martín Santonja. White tunic and cape. White hood with embroidered shield and esparto sash.","costaleros":30,"tunica_nazarenos":"White tunic and cape. White hood with embroidered shield and esparto sash."},{"nombre":"Float of the Most Holy Christ of Expiration","descripcion":"The basket of the float is of Baroque style, work of the Bailac workshops. The powers of the Christ of Expiration are by the goldsmith Jesús Domínguez.","costaleros":30,"tunica_nazarenos":"White tunic and cape. Red hood with embroidered shield and esparto sash."},{"nombre":"Float of Our Lady of Sorrows","descripcion":"The canopy float is the work of the Villarreal workshops. The Virgin''s mantle is the work of Ecija native José Luis Asencio.","costaleros":30,"tunica_nazarenos":"White tunic and cape. Purple hood with embroidered shield and esparto sash."}]'::jsonb,
  day_en = 'Holy Tuesday'
WHERE id = 1277;

UPDATE hermandades SET 
  description_en = 'Sacramental and Royal Archconfraternity of Nazarenes of the Crowning with Thorns of Our Lord Jesus Christ, Saint Mark, Saint Roch, Most Holy Christ of Health, Our Lady of Sorrows, Sacred Heart of Jesus and Saint John of God. Founded: 1581. Canonical seat: San Gil Church. Date: April 16.',
  titulo_completo_en = 'Sacramental and Royal Archconfraternity of Nazarenes of the Crowning with Thorns of Our Lord Jesus Christ, Saint Mark, Saint Roch, Most Holy Christ of Health, Our Lady of Sorrows, Sacred Heart of Jesus and Saint John of God',
  pasos_en = '[{"nombre":"Float of the Mystery of the Crowning with Thorns of Our Lord Jesus Christ","descripcion":"The float is of Baroque style, carved by Manuel Guzmán Bejarano. The skirts, with brooches embroidered in fine gold.","costaleros":35,"tunica_nazarenos":"Purple with white buttons, purple sash. White cape with purple lapels. Passion shield on purple background embroidered on the left shoulder. Short hood covered by purple cowl with shield."},{"nombre":"Float of the Most Holy Christ of Health","descripcion":"The float, of Baroque style, is the work of Antonio Martín. The four evangelists are by Ricardo Comas. The purple damask skirts are designed and embroidered by Joaquín Ojeda.","costaleros":35,"tunica_nazarenos":"Purple with white buttons, purple sash. White cape with purple lapels. Passion shield on purple background embroidered on the left shoulder. Short hood covered by purple cowl with shield."},{"nombre":"Float of Our Lady of Sorrows","descripcion":"Blue velvet mantle, embroidered in fine gold by Ana Antúnez (1882). Canopy ceiling embroidered in gold by Jesús Rosado Borja.","costaleros":30,"tunica_nazarenos":"White with light blue buttons, girded by light blue sash. White cape with light blue lapels. Passion shield on light blue background embroidered on the left shoulder. Short hood covered by light blue cowl with shield."}]'::jsonb,
  day_en = 'Holy Wednesday'
WHERE id = 78066;

UPDATE hermandades SET 
  description_en = 'Royal and Fervent Brotherhood and Confraternity of Penance of the Blessed Saint Francis of Paola, Most Holy Christ of the Sacred Column and Scourges, Most Holy Christ of Confalón, Our Lady of Hope and of the Immaculate Conception of Mary. Founded: 1570. Canonical seat: Victoria Church. Date: April 17.',
  titulo_completo_en = 'Royal and Fervent Brotherhood and Confraternity of Penance of the Blessed Saint Francis of Paola, Most Holy Christ of the Sacred Column and Scourges, Most Holy Christ of Confalón, Our Lady of Hope and of the Immaculate Conception of Mary',
  pasos_en = '[{"nombre":"Float of the Most Holy Christ of the Sacred Column and Scourges","costaleros":35,"tunica_nazarenos":"White tunic, cape and hood, with velvet sash and embroidered shield (burgundy in the mystery)."},{"nombre":"Float of the Most Holy Christ of Confalón","costaleros":35,"tunica_nazarenos":"White tunic, cape and hood, with velvet sash and embroidered shield (black in the Christ)."},{"nombre":"Float of Our Lady of Hope","descripcion":"Our Lady of Hope processes on a canopy float with silver cresting, from the Villarreal workshops. The mantle is green velvet, embroidered in gold, work of Ecija native Emilio Gómez.","costaleros":30,"tunica_nazarenos":"White tunic, cape and hood, with velvet sash and embroidered shield (green in the canopy)."}]'::jsonb,
  day_en = 'Maundy Thursday'
WHERE id = 27120;

UPDATE hermandades SET 
  description_en = 'Royal, Very Ancient and Fervent Brotherhood of the Most Holy Christ of the Blood and Our Lady of Sorrows. Founded: 1564. Canonical seat: Holy Cross Church. Date: April 17.',
  titulo_completo_en = 'Royal, Very Ancient and Fervent Brotherhood of the Most Holy Christ of the Blood and Our Lady of Sorrows',
  pasos_en = '[{"nombre":"Float of the Most Holy Christ of Blood","descripcion":"The float is of neo-baroque style, made of mahogany and silver, work of the carver Don Antonio Martín. The skirts are the work of the Ecija embroiderer Jesús Rosado.","costaleros":35,"tunica_nazarenos":"Red tunic with white cape, esparto sash and red hood."},{"nombre":"Float of Our Lady of Sorrows","descripcion":"The canopy is of red velvet, embroidered in gold by the Carmelite Sisters of the Convent of the Immaculate Conception of Écija. The poles, in sterling silver, are by the goldsmith Jesús Domínguez. The mantle, in black velvet, was embroidered in gold by the Adoratrices Sisters of Écija.","costaleros":30,"tunica_nazarenos":"White tunic with red cape, red sash and white hood."}]'::jsonb,
  day_en = 'Maundy Thursday'
WHERE id = 64425;

UPDATE hermandades SET 
  description_en = 'Sacramental of Our Lady of Mount Carmel, Brotherhood of Nazarenes of the Most Holy Christ of Mercy, Our Father Jesus Descended from the Cross in the Mystery of his Sacred Shroud and Mary Most Holy of Piety. Founded: 1989. Canonical seat: Los Descalzos Church. Date: April 18.',
  titulo_completo_en = 'Sacramental of Our Lady of Mount Carmel, Brotherhood of Nazarenes of the Most Holy Christ of Mercy, Our Father Jesus Descended from the Cross in the Mystery of his Sacred Shroud and Mary Most Holy of Piety',
  pasos_en = '[{"nombre":"Float of the Mystery of the Sacred Shroud","descripcion":"The basket of the float is the work of Ecija native Manuel Díaz. The skirts are by the Ecija embroiderer Jesús Rosado.","tunica_nazarenos":"Brown tunic and scapular, cream hood and black sandals with white socks.","costaleros":35}]'::jsonb,
  day_en = 'Good Friday'
WHERE id = 88787;

UPDATE hermandades SET 
  description_en = 'Very Ancient and Fervent Brotherhood of Our Lady of Piety and Most Holy Christ of the Exaltation on the Cross of Écija. Founded: 1509. Canonical seat: St. Mary''s Church. Date: April 18.',
  titulo_completo_en = 'Very Ancient and Fervent Brotherhood of Our Lady of Piety and Most Holy Christ of the Exaltation on the Cross of Écija',
  pasos_en = '[{"nombre":"Float of the Most Holy Christ of the Exaltation on the Cross","descripcion":"The basket of the float is of Baroque style, work of Ecija native Manuel Díaz.","tunica_nazarenos":"White tunic, black hood and cape.","costaleros":"Carried in the old way, like a stretcher."},{"nombre":"Float of Our Lady of Piety","descripcion":"The Virgin of Piety processes on a canopy float, of burgundy velvet, embroidered in tissue by Joaquín Ojeda. The poles, in sterling silver, are from the Villarreal workshops.","tunica_nazarenos":"White tunic, black hood and cape.","costaleros":30}]'::jsonb,
  day_en = 'Good Friday'
WHERE id = 83972;

UPDATE hermandades SET 
  description_en = 'Pontifical, Illustrious and Very Ancient Brotherhood and Confraternity of Our Father Jesus Nazarene, Holy Cross in Jerusalem, Mary Most Holy of Mercies and Saint John the Evangelist and Saint Francis of Écija. Founded: 1582. Canonical seat: St. John''s Church. Date: April 18.',
  titulo_completo_en = 'Pontifical, Illustrious and Very Ancient Brotherhood and Confraternity of Our Father Jesus Nazarene, Holy Cross in Jerusalem, Mary Most Holy of Mercies and Saint John the Evangelist and Saint Francis of Écija',
  pasos_en = '[{"nombre":"Float of Our Father Jesus Nazarene","descripcion":"The float is of Baroque style, work of Antonio Martín. The four evangelists are by Ricardo Comas and the purple damask skirts are designed and embroidered by Joaquín Ojeda.","costaleros":35,"tunica_nazarenos":"Black with cape gathered at the sash, black hood; the Jerusalem cross in red."},{"nombre":"Float of Our Lady of Mercies","descripcion":"The canopy is of gold mesh, from the Brenes workshops. The mantle, of purple velvet, is from the embroidery workshop of Grande de León. The poles, in sterling silver, are the work of goldsmith Manuel de los Ríos.","costaleros":30,"tunica_nazarenos":"Black with cape gathered at the sash, black hood; the Jerusalem cross in red."}]'::jsonb,
  day_en = 'Good Friday'
WHERE id = 47463;

UPDATE hermandades SET 
  description_en = 'Royal and Venerable Brotherhood and Cofraternity of Nazarenes of Our Father Jesus Nazarene Embraced to the Cross and Mary Most Holy of Bitterness. Founded: 1666. Canonical seat: Holy Cross Church. Date: April 18.',
  titulo_completo_en = 'Royal and Venerable Brotherhood and Cofraternity of Nazarenes of Our Father Jesus Nazarene Embraced to the Cross and Mary Most Holy of Bitterness',
  pasos_en = '[{"nombre":"Float of Our Father Jesus Nazarene Embraced to the Cross","tunica_nazarenos":"Purple tunic with black buttons, black cape and hood and esparto sash.","costaleros":30},{"nombre":"Float of Mary Most Holy of Bitterness","descripcion":"The Virgin of Bitterness processes under a burgundy velvet canopy. The vents and poles are the work of the goldsmith Villarreal.","tunica_nazarenos":"Purple tunic with black buttons, black cape and hood and esparto sash.","costaleros":30}]'::jsonb,
  day_en = 'Good Friday'
WHERE id = 34963;

UPDATE hermandades SET 
  description_en = 'Brotherhood and Confraternity of Our Father Jesus Without Rope, Our Lady of Faith and Sacred Hearts of Jesus and Mary. Founded: 1977. Canonical seat: St. Barbara Church. Date: April 18.',
  titulo_completo_en = 'Brotherhood and Confraternity of Our Father Jesus Without Rope, Our Lady of Faith and Sacred Hearts of Jesus and Mary',
  pasos_en = '[{"nombre":"Float of Our Father Jesus Without Rope","descripcion":"The float was acquired from the Brotherhood of Silence of Écija.","tunica_nazarenos":"White tunic without sash, white hood without cone.","costaleros":30},{"nombre":"Float of Our Lady of Faith","descripcion":"The canopy is the work of Ecija native José Luis Asencio.","tunica_nazarenos":"White tunic without sash, white hood without cone.","costaleros":30}]'::jsonb,
  day_en = 'Good Friday'
WHERE id = 77415;

UPDATE hermandades SET 
  description_en = 'Royal Brotherhood of Our Lady of Solitude and Holy Burial of Our Lord Jesus Christ. Founded: 1573 (Rule Approval). Canonical seat: Our Lady of Mount Carmel Church. Date: April 19.',
  titulo_completo_en = 'Royal Brotherhood of Our Lady of Solitude and Holy Burial of Our Lord Jesus Christ',
  pasos_en = '[{"nombre":"Float of the Holy Burial of Our Lord Jesus Christ","descripcion":"The urn, of tortoiseshell and silver, is the work of Juan de Mesa. It bears on the corners the four Evangelists, carved by Duque Cornejo.","tunica_nazarenos":"White color, black cape and black velvet hood with white piping; also black velvet sash. The capes bear the Brotherhood''s shield on the left shoulder.","costaleros":"This float is carried on wheels."},{"nombre":"Float of Our Lady of Solitude","tunica_nazarenos":"White color, black cape and black velvet hood with white piping; also black velvet sash. The capes bear the Brotherhood''s shield on the left shoulder.","costaleros":30}]'::jsonb,
  day_en = 'Holy Saturday'
WHERE id = 43437;

UPDATE hermandades SET 
  description_en = 'Brotherhood of the Most Blessed Sacrament, Glorious Resurrection of Our Lord Jesus Christ, Mary Most Holy of Joy and Saint Mary Magdalene. Founded: 1601. Canonical seat: Holy Cross Church. Date: April 20.',
  titulo_completo_en = 'Brotherhood of the Most Blessed Sacrament, Glorious Resurrection of Our Lord Jesus Christ, Mary Most Holy of Joy and Saint Mary Magdalene',
  pasos_en = '[{"nombre":"Float of the Risen Lord","tunica_nazarenos":"Cream colored tunic, white hood, white cape with red stripes on the sides.","costaleros":"Not specified"},{"nombre":"Float of Our Lady of Joy","descripcion":"The canopy is the work of Jesús Rosado Borja.","tunica_nazarenos":"Cream colored tunic, white hood, white cape with light blue stripes on the sides.","costaleros":"Not specified"}]'::jsonb,
  day_en = 'Easter Sunday'
WHERE id = 9329;


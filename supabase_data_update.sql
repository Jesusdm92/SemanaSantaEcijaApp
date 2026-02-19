-- Script to update 'pasos' and 'web_oficial' columns in Supabase
-- Run this in the Supabase SQL Editor

UPDATE hermandades SET 
  pasos = '[{"nombre":"Paso de Nuestro Padre Jesús del Amor en su Prendimiento","tunica_nazarenos":"Túnica de cola y capillo de color blanco. Fajín de esparto y sandalias de color avellana con calcetín blanco."}]'::jsonb,
  web_oficial = 'http://www.amoryconcepcion.blogspot.com.es/',
  titulo_completo = 'Sacramental del Glorioso Patriarca San José y Cofradía de Nazarenos de Ntro. Padre Jesús del Amor en su Prendimiento y María Stma. de la Concepción',
  ano_fundacion = '2017'
WHERE id = 75910;

UPDATE hermandades SET 
  pasos = '[{"nombre":"Paso de la Entrada de Jesús en Jerusalén","descripcion":"El bordado de los faldones-respiraderos están confeccionados por el artista ecijano Jesús Rosado Borja.","tunica_nazarenos":"Negra, capa blanca, capillo blanco y cíngulo de esparto.","costaleros":35}]'::jsonb,
  web_oficial = 'www.hermandaddelcautivo.es',
  titulo_completo = 'ILUSTRE Y FERVOROSA HERMANDAD Y COFRADÍA DE NAZARENOS DE LA SAGRADA ENTRADA TRIUNFAL DE JESÚS EN JERUSALÉN, NUESTRO PADRE JESÚS CAUTIVO Y NUESTRA MADRE Y SEÑORA DE LAS LÁGRIMAS Y SANTA MARÍA EN SU INMACULADA CONCEPCIÓN',
  ano_fundacion = '1955'
WHERE id = 26978;

UPDATE hermandades SET 
  pasos = '[{"nombre":"Paso de Nuestro Padre Jesús Cautivo","descripcion_imagen":"La imagen es de un autor anónimo del siglo XVIII.","tunica_nazarenos":"Negra, capa blanca, capillo blanco y cíngulo de esparto.","costaleros":30},{"nombre":"Paso de Nuestra Señora de las Lágrimas","descripcion":"Nuestra Señora de las Lágrimas procesiona en paso de palio bordado sobre terciopelo color «burdeos», obra de José Luis Asencio.","tunica_nazarenos":"Negra, capa blanca capillo negro y cíngulo de esparto.","costaleros":30}]'::jsonb,
  web_oficial = 'www.hermandaddelcautivo.es',
  titulo_completo = 'ILUSTRE Y FERVOROSA HERMANDAD Y COFRADÍA DE NAZARENOS DE LA SAGRADA ENTRADA TRIUNFAL DE JESÚS EN JERUSALÉN, NUESTRO PADRE JESÚS CAUTIVO Y NUESTRA MADRE Y SEÑORA DE LAS LÁGRIMAS Y SANTA MARÍA EN SU INMACULADA CONCEPCIÓN',
  ano_fundacion = '1955'
WHERE id = 57188;

UPDATE hermandades SET 
  pasos = '[{"nombre":"Paso del Santísimo Cristo de la Yedra","tunica_nazarenos":"Túnica y capillo verde. Capa blanca y cíngulo de esparto anudado a la izquierda.","costaleros":30},{"nombre":"Paso de Nuestra Señora de la Caridad","descripcion":"El palio es obra del ecijano José Luis Asencio. El manto, de terciopelo color azul pavo, es obra de las monjas del Convento de Santa Isabel de Écija. Los varales, en plata de ley, son de los talleres de Villarreal.","tunica_nazarenos":"Túnica y capillo verde. Capa blanca y cíngulo de esparto anudado a la izquierda.","costaleros":30}]'::jsonb,
  web_oficial = 'www.hermandadyedraecija.com',
  titulo_completo = 'Fervorosa Hermandad del Santísimo Cristo de la Yedra y Nuestra Señora de la Caridad',
  ano_fundacion = '1959'
WHERE id = 68445;

UPDATE hermandades SET 
  pasos = '[{"nombre":"Paso de Nuestro Padre Jesús Nazareno de la Misericordia","descripcion":"El canasto del paso es obra del ecijano José Luis Asencio. Los faldones son del taller de Mariano Martín Santonja. Túnica y capa blanca. Capillo blanco con escudo bordado y cíngulo de esparto.","costaleros":30,"tunica_nazarenos":"Túnica y capa blanca. Capillo blanco con escudo bordado y cíngulo de esparto."},{"nombre":"Paso del Santísimo Cristo de la Expiración","descripcion":"El canasto del paso es de estilo barroco, obra de los talleres de Bailac. Las potencias del Cristo de la Expiración son del orfebre Jesús Domínguez.","costaleros":30,"tunica_nazarenos":"Túnica y capa blanca. Capillo rojo con escudo bordado y cíngulo de esparto."},{"nombre":"Paso de Nuestra Señora de los Dolores","descripcion":"El paso de palio es obra de los talleres de Villarreal. El manto de la Virgen es obra del ecijano José Luis Asencio.","costaleros":30,"tunica_nazarenos":"Túnica y capa blanca. Capillo morado con escudo bordado y cíngulo de esparto."}]'::jsonb,
  web_oficial = 'www.hermandad-expiracion.es',
  titulo_completo = 'Hermandad del Santísimo Cristo de la Expiración, Nuestra Señora de los Dolores y Nuestro Padre Jesús Nazareno de la Misericordia (Hermandad de los Estudiantes)',
  ano_fundacion = '1579'
WHERE id = 1277;

UPDATE hermandades SET 
  pasos = '[{"nombre":"Paso del Misterio de la Coronación de Espinas de Nuestro Señor Jesucristo","descripcion":"El paso es de estilo barroco, tallado por Manuel Guzmán Bejarano. Los faldones, con broches bordados en oro fino.","costaleros":35,"tunica_nazarenos":"Morada con botonadura blanca, fajín morado. Capa blanca con vueltas moradas. Escudo de pasión sobre fondo morado bordado sobre el hombro izquierdo. Capirote corto cubierto por capillo morado con escudo."},{"nombre":"Paso del Santísimo Cristo de la Salud","descripcion":"El paso, de estilo barroco, es obra de Antonio Martín. Los cuatro evangelistas son de Ricardo Comas. Los faldones de damasco morado son de diseño y bordado de Joaquín Ojeda.","costaleros":35,"tunica_nazarenos":"Morada con botonadura blanca, fajín morado. Capa blanca con vueltas moradas. Escudo de pasión sobre fondo morado bordado sobre el hombro izquierdo. Capirote corto cubierto por capillo morado con escudo."},{"nombre":"Paso de Nuestra Señora de los Dolores","descripcion":"Manto de terciopelo azul, bordado en oro fino por Ana Antúnez (1882). Techo de palio bordado en oro por Jesús Rosado Borja.","costaleros":30,"tunica_nazarenos":"Blanca con botonadura celeste, ceñida por fajín celeste. Capa blanca con vueltas celestes. Escudo de pasión sobre fondo celeste bordado sobre el hombro izquierdo. Capirote corto cubierto por capillo celeste con escudo."}]'::jsonb,
  web_oficial = 'www.hermandadsangil.es',
  titulo_completo = 'Sacramental y Real Archicofradía de Nazarenos de la Coronación de Espinas de Nuestro Señor Jesucristo, San Marcos, San Roque, Santísimo Cristo de la Salud, Nuestra Señora de los Dolores, Sagrado Corazón de Jesús y San Juan de Dios',
  ano_fundacion = '1581'
WHERE id = 78066;

UPDATE hermandades SET 
  pasos = '[{"nombre":"Paso del Santísimo Cristo de la Sagrada Columna y Azotes","costaleros":35,"tunica_nazarenos":"Túnica, capa y capillo blancos, con fajín de terciopelo y escudo bordado (burdeos en el misterio)."},{"nombre":"Paso del Santísimo Cristo de Confalón","costaleros":35,"tunica_nazarenos":"Túnica, capa y capillo blancos, con fajín de terciopelo y escudo bordado (negro en el Cristo)."},{"nombre":"Paso de Nuestra Señora de la Esperanza","descripcion":"Nuestra Señora de la Esperanza procesiona en paso de palio con crestería de plata, de los talleres de Villarreal. El manto es de terciopelo verde, bordado en oro, obra del ecijano Emilio Gómez.","costaleros":30,"tunica_nazarenos":"Túnica, capa y capillo blancos, con fajín de terciopelo y escudo bordado (verde en el palio)."}]'::jsonb,
  web_oficial = 'www.hermandaddeconfalon.es',
  titulo_completo = 'Real y Fervorosa Hermandad y Confradía de Penitencia del Bienaventurado San Francisco de Paula, Santísimo Cristo de la Sagrada Columna y Azotes, Santísimo Cristo de Confalón, Nuestra Señora de la Esperanza y de la Purísima Concepción de María',
  ano_fundacion = '1570'
WHERE id = 27120;

UPDATE hermandades SET 
  pasos = '[{"nombre":"Paso del Santísimo Cristo de la Sangre","descripcion":"El paso es de estilo neobarroco, de caoba y plata, obra del tallista don Antonio Martín. Los faldones son obra del bordador ecijano Jesús Rosado.","costaleros":35,"tunica_nazarenos":"Túnica roja con capa blanca, cíngulo de esparto y capillo rojo."},{"nombre":"Paso de Nuestra Señora de los Dolores","descripcion":"El palio es de terciopelo rojo, bordado en oro por las Hermanas Carmelitas del Convento de la Purísima Concepción de Écija. Los varales, en plata de ley, son del orfebre Jesús Domínguez. El manto, en terciopelo negro, fue bordado en oro por las Hermanas Adoratrices de Écija.","costaleros":30,"tunica_nazarenos":"Túnica blanca con capa roja, cíngulo rojo y capillo blanco."}]'::jsonb,
  web_oficial = 'http://hermandadlasangre.es/',
  titulo_completo = 'Real, Muy Antigua y Fervorosa Hermandad del Santísimo Cristo de la Sangre y Nuestra Señora de los Dolores',
  ano_fundacion = '1564'
WHERE id = 64425;

UPDATE hermandades SET 
  pasos = '[{"nombre":"Paso de Misterio de la Sagrada Mortaja","descripcion":"El canasto del paso es obra del ecijano Manuel Díaz. Los faldones son del bordador ecijano Jesús Rosado.","tunica_nazarenos":"Túnica y escapulario de color marrón, capillo de color crema y sandalias negras con calcetines blancos.","costaleros":35}]'::jsonb,
  web_oficial = 'http://www.lamortaja.es/',
  titulo_completo = 'Sacramental de Nuestra Señora del Carmen, Cofradía de Nazarenos de Santísimo Cristo de la Misericordia, Nuestro Padre Jesús Descendido de la Cruz en el Misterio de su Sagrada Mortaja y María Santísima de la Piedad',
  ano_fundacion = '1989'
WHERE id = 88787;

UPDATE hermandades SET 
  pasos = '[{"nombre":"Paso del Santísimo Cristo de la Exaltación en la Cruz","descripcion":"El canasto del paso es de estilo barroco, obra del ecijano Manuel Díaz.","tunica_nazarenos":"Túnica blanca, capillo y capa negra.","costaleros":"Llevado a la antigua usanza, a manera de andas."},{"nombre":"Paso de Nuestra Señora de la Piedad","descripcion":"La Virgen de la Piedad procesiona en paso de palio, de terciopelo color burdeos, bordado en tisú por Joaquín Ojeda. Los varales, en plata de ley, son de los talleres de Villarreal.","tunica_nazarenos":"Túnica blanca, capillo y capa negra.","costaleros":30}]'::jsonb,
  web_oficial = 'Información no encontrada',
  titulo_completo = 'Muy Antigua y Fervorosa Hermandad de Nuestra Señora de la Piedad y Santísimo Cristo de la Exaltación en la Cruz de Écija',
  ano_fundacion = '1509'
WHERE id = 83972;

UPDATE hermandades SET 
  pasos = '[{"nombre":"Paso de Nuestro Padre Jesús Nazareno","descripcion":"El paso es de estilo barroco, obra de Antonio Martín. Los cuatro evangelistas son de Ricardo Comas y los faldones de damasco morado de diseño y bordado de Joaquín Ojeda.","costaleros":35,"tunica_nazarenos":"Negra con capa recogida en el fajín, capillo negro; la cruz de Jerusalén en rojo."},{"nombre":"Paso de Nuestra Señora de las Misericordias","descripcion":"El palio es de malla de oro, de los talleres de Brenes. El manto, de terciopelo morado, es del taller de bordados de Grande de León. Los varales, en plata de ley, son obra del orfebre Manuel de los Ríos.","costaleros":30,"tunica_nazarenos":"Negra con capa recogida en el fajín, capillo negro; la cruz de Jerusalén en rojo."}]'::jsonb,
  web_oficial = 'www.hermandaddesanjuan.com',
  titulo_completo = 'Pontificia, Ilustre y Muy Antigua Hermandad y Confradía de Nuestro Padre Jesús Nazareno, Santa Cruz en Jerusalén, María Santísima de las Misericordias y San Juan Evangelista y San Francisco de Écija',
  ano_fundacion = '1582'
WHERE id = 47463;

UPDATE hermandades SET 
  pasos = '[{"nombre":"Paso de Nuestro Padre Jesús Nazareno Abrazado a la Cruz","tunica_nazarenos":"Túnica morada con botonadura negra, capa y capillo negro y cíngulo de esparto.","costaleros":30},{"nombre":"Paso de María Santísima de la Amargura","descripcion":"La Virgen de la Amargura procesiona bajo palio de terciopelo color burdeos. Los respiraderos y varales son obra del orfebre Villarreal.","tunica_nazarenos":"Túnica morada con botonadura negra, capa y capillo negro y cíngulo de esparto.","costaleros":30}]'::jsonb,
  web_oficial = 'http://www.elsilenciodeecija.com/',
  titulo_completo = 'Real y Venerable Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús Nazareno Abrazado a la Cruz y María Santísima de la Amargura',
  ano_fundacion = '1666'
WHERE id = 34963;

UPDATE hermandades SET 
  pasos = '[{"nombre":"Paso de Nuestro Padre Jesús Sin Soga","descripcion":"El paso fue adquirido a la Hermandad del Silencio de Écija.","tunica_nazarenos":"Túnica blanca sin cíngulo, capillo blanco sin capirote.","costaleros":30},{"nombre":"Paso de Nuestra Señora de la Fe","descripcion":"El palio es obra del ecijano José Luis Asencio.","tunica_nazarenos":"Túnica blanca sin cíngulo, capillo blanco sin capirote.","costaleros":30}]'::jsonb,
  web_oficial = 'www.jesussinsoga.com',
  titulo_completo = 'Hermandad y Cofradía de Nuestro Padre Jesús Sin Soga, Nuestra Señora de la Fe y Sagrados Corazones de Jesús y María',
  ano_fundacion = '1977'
WHERE id = 77415;

UPDATE hermandades SET 
  pasos = '[{"nombre":"Paso del Santo Entierro de Nuestro Señor Jesucristo","descripcion":"La urna, de carey y plata, es obra de Juan de Mesa. Lleva en las esquinas los cuatro Evangelistas, tallados por Duque Cornejo.","tunica_nazarenos":"Color blanca, capa negra y capillo en terciopelo negro con vivo blanco; fajín también en terciopelo negro. Las capas llevan sobre el hombro izquierdo el escudo de la Hermandad.","costaleros":"Este paso es llevado sobre ruedas."},{"nombre":"Paso de Nuestra Señora de la Soledad","tunica_nazarenos":"Color blanca, capa negra y capillo en terciopelo negro con vivo blanco; fajín también en terciopelo negro. Las capas llevan sobre el hombro izquierdo el escudo de la Hermandad.","costaleros":30}]'::jsonb,
  web_oficial = 'http://soledadecija.org/',
  titulo_completo = 'Real Hermandad de Nuestra Señora de la Soledad y Santo Entierro de Nuestro Señor Jesucristo',
  ano_fundacion = '1573 (Aprobación de Reglas)'
WHERE id = 43437;

UPDATE hermandades SET 
  pasos = '[{"nombre":"Paso del Señor Resucitado","tunica_nazarenos":"Túnica color crema, capillo blanco, capa blanca con franjas rojas a los lados.","costaleros":"No especificado"},{"nombre":"Paso de Nuestra Señora de la Alegría","descripcion":"El palio es obra de Jesús Rosado Borja.","tunica_nazarenos":"Túnica color crema, capillo blanco, capa blanca con franjas celestes a los lados.","costaleros":"No especificado"}]'::jsonb,
  web_oficial = 'www.hermandadresucitado.org',
  titulo_completo = 'Hermandad del Santísimo Sacramento, Gloriosa Resurrección de Nuestro Señor Jesucristo, María Santísima de la Alegría y Santa María Magdalena',
  ano_fundacion = '1601'
WHERE id = 9329;


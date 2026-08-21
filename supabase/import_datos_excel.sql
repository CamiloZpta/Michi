-- ==========================================
-- MICHI · Importar gastos históricos del Excel
-- ==========================================
-- 1. Ve a Table Editor -> households, copia el 'id' de tu hogar y pégalo abajo.
-- 2. Corre esto UNA sola vez en el SQL Editor. Es seguro de re-correr por error
--    (usa 'on conflict do nothing' no aplica aquí, así que si lo corres dos veces
--    vas a duplicar los registros -- solo corre una vez).

do $$
declare
  hh_id uuid := 'PEGA_AQUI_TU_HOUSEHOLD_ID';
begin
  insert into gastos (household_id, categoria_id, producto, precio, cantidad_total, unidad, fecha)
  values
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Juguetes'), 'Pelotitas x6', 6000.0, 1.0, 'unidades', '2026-04-01'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Otros'), 'Comedero cerámica', 49800.0, 2.0, 'unidades', '2026-04-01'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Salud'), 'Pañitos humedos', 10000.0, 1.0, 'unidades', '2026-04-01'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Otros'), 'Cama', 60000.0, 1.0, 'unidades', '2026-04-01'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Otros'), 'Cobija', 18000.0, 1.0, 'unidades', '2026-04-01'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Otros'), 'Arenero', 48800.0, 1.0, 'unidades', '2026-04-01'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Otros'), 'Fuente de agua', 62000.0, 1.0, 'unidades', '2026-04-01'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Arena'), 'Arena Tofu Silvester', 45000.0, 5.0, 'kg', '2026-04-01'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Alimento'), 'Diamond Kitten', 87200.0, 3.0, 'kg', '2026-04-01'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Salud'), 'Churu x4', 12300.0, 1.0, 'unidades', '2026-04-01'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Alimento'), 'Cat Chow gatitos', 15000.0, 500.0, 'gr', '2026-04-01'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Salud'), 'Lacto reemplazador gradual', 46300.0, 100.0, 'gr', '2026-04-01'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Otros'), 'Rascador en forma de queso', 18000.0, 1.0, 'unidades', '2026-04-04'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Otros'), 'Recipiente para alimentos secos', 16000.0, 1.0, 'unidades', '2026-04-04'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Otros'), 'Cesta para organizar', 16000.0, 1.0, 'unidades', '2026-04-04'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Juguetes'), 'Varita con gusano', 7000.0, 1.0, 'unidades', '2026-04-04'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Juguetes'), 'Juguete con cascabel y pluma', 14000.0, 1.0, 'unidades', '2026-04-04'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Arena'), 'Arena Tofu Premium', 28000.0, 2.5, 'kg', '2026-04-25'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Salud'), 'Pipeta desparasitante', 55000.0, 1.0, 'unidades', '2026-04-25'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Salud'), 'Pipeta desparasitante', 55000.0, 1.0, 'unidades', '2026-04-25'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Salud'), 'Desparasitante', 46000.0, 1.0, 'unidades', '2026-04-13'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Alimento'), 'Diamond Kitten', 89200.0, 3.0, 'kg', '2026-05-04'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Otros'), 'Spray antidaños', 8000.0, 150.0, 'ml', '2026-05-21'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Arena'), 'Arena popis tofu', 20700.0, 2.5, 'kg', '2026-05-22'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Arena'), 'Popis cat', 20700.0, 2.5, 'kg', '2026-06-09'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Alimento'), 'Diamond Kitten', 77800.0, 3.0, 'kg', '2026-05-25'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Juguetes'), 'Gimnasio', 269000.0, 1.0, 'unidades', '2026-06-08'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Alimento'), 'Diamond Kittens', 77800.0, 3.0, 'kg', '2026-06-13'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Otros'), 'Guacales', 80400.0, 2.0, 'unidades', '2026-07-02'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Arena'), 'Popis cat', 20700.0, 2.5, 'kg', '2026-06-22'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Otros'), 'Fuente de agua', 44250.0, 1.0, 'unidades', '2026-07-03'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Alimento'), 'Diamond Kittens', 77800.0, 3.0, 'kg', '2026-07-06'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Otros'), 'Churu', 3700.0, 1.0, 'unidades', '2026-07-06'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Arena'), 'Popis Cat Manzana', 127800.0, 18.0, 'kg', '2026-07-06'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Alimento'), 'Diamond Kittens', 77800.0, 3.0, 'kg', '2026-07-28'),
    (hh_id, (select id from categorias where household_id = hh_id and nombre = 'Alimento'), 'Diamond Kittens', 77800.0, 3.0, 'kg', '2026-08-18');
end $$;
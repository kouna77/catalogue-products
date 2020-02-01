SET FOREIGN_KEY_CHECKS = 0;
alter table stocks add column denree_id INTEGER UNSIGNED NOT NULL;
ALTER TABLE stocks
    ADD CONSTRAINT fk_stocks_denrees FOREIGN KEY(denree_id)
        REFERENCES denrees(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE;
SET FOREIGN_KEY_CHECKS = 1;

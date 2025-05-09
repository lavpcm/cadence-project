-- Ativar extensão de UUID, se ainda não estiver ativa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Apagar tabelas existentes, se houver
DROP TABLE IF EXISTS habit_tracker CASCADE;
DROP TABLE IF EXISTS habit CASCADE;
DROP TABLE IF EXISTS category CASCADE;

-- Criar tabela de Categorias de Hábitos
CREATE TABLE category (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(100) NOT NULL
);

-- Criar tabela de Hábitos
CREATE TABLE habit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID,
    title VARCHAR(100) NOT NULL,
    more_info VARCHAR(500),
    frequency VARCHAR(100) NOT NULL,
    
    FOREIGN KEY (category_id) REFERENCES category(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Criar tabela de Habit Tracker (Registro de Hábitos)
CREATE TABLE habit_tracker (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID REFERENCES habit(id),
    current_day DATE NOT NULL,
    done BOOLEAN NOT NULL,

    FOREIGN KEY (habit_id) REFERENCES habit(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

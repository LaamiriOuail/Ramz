use std::fmt;

#[derive(Debug, Clone, PartialEq)]
pub enum RamzType {
    Number,
    Float,
    String,
    Boolean,
    List,
    Dictionary,
    Tuple,
    Any,
}

impl fmt::Display for RamzType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            RamzType::Number => write!(f, "رقم"),
            RamzType::Float => write!(f, "عشري"),
            RamzType::String => write!(f, "نص"),
            RamzType::Boolean => write!(f, "منطقية"),
            RamzType::List => write!(f, "قائمة"),
            RamzType::Dictionary => write!(f, "قاموس"),
            RamzType::Tuple => write!(f, "زوج"),
            RamzType::Any => write!(f, "أي"),
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub enum RamzValue {
    Number(i64),
    Float(f64),
    String(String),
    Boolean(bool),
    List(Vec<RamzValue>),
    Dictionary(Vec<(String, RamzValue)>),
    Tuple(Vec<RamzValue>),
}

impl RamzValue {
    pub fn get_type(&self) -> RamzType {
        match self {
            RamzValue::Number(_) => RamzType::Number,
            RamzValue::Float(_) => RamzType::Float,
            RamzValue::String(_) => RamzType::String,
            RamzValue::Boolean(_) => RamzType::Boolean,
            RamzValue::List(_) => RamzType::List,
            RamzValue::Dictionary(_) => RamzType::Dictionary,
            RamzValue::Tuple(_) => RamzType::Tuple,
        }
    }
}

impl fmt::Display for RamzValue {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            RamzValue::Number(n) => write!(f, "{}", n),
            RamzValue::Float(fl) => write!(f, "{}", fl),
            RamzValue::String(s) => write!(f, "{}", s),
            RamzValue::Boolean(b) => write!(f, "{}", if *b { "صحيح" } else { "خطأ" }),
            RamzValue::List(items) => {
                write!(f, "[")?;
                for (i, item) in items.iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "{}", item)?;
                }
                write!(f, "]")
            }
            RamzValue::Dictionary(pairs) => {
                write!(f, "{{")?;
                for (i, (key, value)) in pairs.iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "{}: {}", key, value)?;
                }
                write!(f, "}}")
            }
            RamzValue::Tuple(items) => {
                write!(f, "(")?;
                for (i, item) in items.iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "{}", item)?;
                }
                write!(f, ")")
            }
        }
    }
}

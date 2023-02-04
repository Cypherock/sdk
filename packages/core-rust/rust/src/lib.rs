// use wasm_bindgen::prelude::*;

// #[wasm_bindgen]
// pub fn add(a: u32, b: u32) -> u32 {
//     a + b
// }

// src/lib.rs

// Use a procedural macro to generate bindings for the world we specified in
// `host.wit`
wit_bindgen_guest_rust::generate!("host");

// Define a custom type and implement the generated `Host` trait for it which
// represents implementing all the necesssary exported interfaces for this
// component.
struct MyHost;

impl Host for MyHost {
    fn run() {
        print("Hello, world!");
    }
}

export_host!(MyHost);

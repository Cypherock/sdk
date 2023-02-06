wit_bindgen_guest_rust::generate!("sdk");

// Define a custom type and implement the generated `Host` trait for it which
// represents implementing all the necesssary exported interfaces for this
// component.
struct MySdk;

impl Sdk for MySdk {
    fn run() {
        connection::is_connected();
        connection::get_connection_type();
        connection::get_sequence_number();
        connection::get_new_sequence_number();
        // Do nothing
    }
}

export_sdk!(MySdk);

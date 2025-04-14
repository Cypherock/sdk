with import <nixpkgs> {};
  stdenv.mkDerivation {
    name = "sdk";
    nativeBuildInputs = [
      pkg-config
    ];
    buildInputs = [
      nodejs_18
      nodePackages.pnpm
      protobuf
      python312
      nodePackages.node-gyp
      python312Packages.click
      python312Packages.ghp-import
      python312Packages.jinja2
      python312Packages.markdown
      python312Packages.markupsafe
      python312Packages.mergedeep
      python312Packages.mkdocs
      python312Packages.packaging
      python312Packages.pathspec
      python312Packages.platformdirs
      python312Packages.python-dateutil
      python312Packages.python-slugify
      python312Packages.pyyaml
      python312Packages.pyyaml-env-tag
      python312Packages.six
      python312Packages.text-unidecode
      python312Packages.watchdog
      libusb1
    ];
    LD_LIBRARY_PATH = "${libusb1.out}/lib";
  }

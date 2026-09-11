type options = {
  @as(`ALLOWED_TAGS`) allowedTags: array<string>,
  @as(`RETURN_TRUSTED_TYPE`) returnTrustedType: bool, // true
}

@module("dompurify")
external sanitize: (string, options) => string = "sanitize"

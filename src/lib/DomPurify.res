type options = {
  @as(`ALLOWED_TAGS`) allowedTags: array<string>,
  @as(`RETURN_TRUSTED_TYPE`) returnTrusedType: bool, // true
}

type trustedHTML = {}

@module("dompurify")
external sanitize: (string, options) => trustedHTML = "sanitize"

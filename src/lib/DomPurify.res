type options = {
  @as(`ALLOWED_TAGS`) allowedTags: array<string>,
  @as(`RETURN_TRUSTED_TYPE`) returnTrustedType: bool, // true
}

type t = {
  @meth sanitize: (string, options) => string,
}

@module("dompurify") external default: t = "default"

type t<'v> = {detail: 'v}

@new external make: (string, t<'v>) => WebAPI.EventTypes.event = "CustomEvent"

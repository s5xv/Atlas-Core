module.exports = {
  guilds: {
    "1528793481273671832": {
      name: "Atlas Holdings", color: "#D4AF37", staff_role_id: "STAFF_ROLE_ID",
      member_role_id: "", unverified_role_id: "",
      category_id: "1528865269315932380", ticket_panel_channel_id: "PANEL_CHANNEL_ID", log_channel_id: "1528796148062752900", audit_channel_id: "1528796148062752900",
      ticket_text: "Atlas Holdings support. State your issue below and staff will help you.",
      notification_roles: [
        { label: "Update Pings", role_id: "UPDATE_PING_ROLE_ID" },
        { label: "Event Pings", role_id: "EVENT_PING_ROLE_ID" }
      ]
    },
    "1528796628457361449": {
      name: "Hermes Net", color: "#2980B9", staff_role_id: "STAFF_ROLE_ID",
      member_role_id: "1528798225480286370", unverified_role_id: "",
      category_id: "1528865513503985737", ticket_panel_channel_id: "PANEL_CHANNEL_ID", log_channel_id: "1528799387080462416", audit_channel_id: "1528799387080462416",
      ticket_text: "Hermes Net support. State your issue or question below.",
      notification_roles: [
        { label: "Update Pings", role_id: "UPDATE_PING_ROLE_ID" },
        { label: "Event Pings", role_id: "EVENT_PING_ROLE_ID" }
      ]
    },
    "1528804420383674559": {
      name: "Plutus Bank", color: "#1E4620", staff_role_id: "STAFF_ROLE_ID",
      member_role_id: "1528804886597206243", unverified_role_id: "",
      category_id: "1528865352568541224", ticket_panel_channel_id: "PANEL_CHANNEL_ID", log_channel_id: "1528807272724172820", audit_channel_id: "1528807272724172820",
      ticket_text: "Plutus Bank support. State your question or report below.",
      notification_roles: [
        { label: "Update Pings", role_id: "UPDATE_PING_ROLE_ID" },
        { label: "Event Pings", role_id: "EVENT_PING_ROLE_ID" }
      ]
    },
    "1528809601674514502": {
      name: "Demeter Realty", color: "#78281F", staff_role_id: "STAFF_ROLE_ID",
      member_role_id: "1528839954564644984", unverified_role_id: "",
      category_id: "1528865011412504576", ticket_panel_channel_id: "PANEL_CHANNEL_ID", log_channel_id: "1528840853903118336", audit_channel_id: "1528840853903118336",
      ticket_text: "Demeter Realty support. Let us know how we can assist you.",
      notification_roles: [
        { label: "Update Pings", role_id: "UPDATE_PING_ROLE_ID" },
        { label: "Event Pings", role_id: "EVENT_PING_ROLE_ID" }
      ]
    },
    "1534966276290646027": {
      name: "Z&E Realty", color: "#78281F", staff_role_id: "STAFF_ROLE_ID",
      member_role_id: "", unverified_role_id: "",
      category_id: "", ticket_panel_channel_id: "PANEL_CHANNEL_ID", log_channel_id: "", audit_channel_id: "",
      ticket_text: "Z&E Realty support. Let us know how we can assist you.",
      notification_roles: [
        { label: "Update Pings", role_id: "UPDATE_PING_ROLE_ID" },
        { label: "Event Pings", role_id: "EVENT_PING_ROLE_ID" }
      ]
    }
  },

  automod: {
    blockedWords: ["badword1", "badword2", "spamlink"],
    capsThreshold: 0.7, maxMentions: 5, maxSpoilers: 3, maxEmojis: 5,
    inviteFilter: true, linkFilter: false, linkWhitelist: [], linkBlacklist: [],
    raidJoinThreshold: 10, raidWindowMs: 60000
  },

  antispam: { maxMessages: 5, windowMs: 3000, timeoutDurationMs: 600000 },

  tickets: { autoCloseHours: 24, maxPerUser: 3 },

  serverBlacklist: [],

  owners: []
};

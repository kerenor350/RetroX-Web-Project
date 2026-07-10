const PERSONA_AVATARS = [
    "assets/man1.jpg",
    "assets/girl1.jpg",
    "assets/woman1.jpg",
    "assets/woman2.jpg"
];

const LEGACY_PERSONA_AVATARS = [
    "assets/woman1 (1).jpg"
];

function isValidPersonaAvatar(image) {
    return (
        PERSONA_AVATARS.includes(image) ||
        LEGACY_PERSONA_AVATARS.includes(image)
    );
}

module.exports = {
    PERSONA_AVATARS,
    LEGACY_PERSONA_AVATARS,
    isValidPersonaAvatar
};

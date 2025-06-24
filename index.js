const { Client, GatewayIntentBits, Partials, EmbedBuilder, PermissionsBitField } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

const TOKEN = 'MTM4NjQ0OTQwMDUzNjIzNjA4Mg.GFhnXJ.JM73ZrH6-x8_v9ohbOhZMEogA78Cqh59-1Gabk'; // غيرها بتوكن بوتك

client.once('ready', () => {
  console.log(`تم تسجيل الدخول كبوت: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'server') {
    const guild = interaction.guild;
    if (!guild) return interaction.reply('هذه الرسالة في سيرفر فقط.');

    // جلب جميع الأعضاء (لو السيرفر كبير ممكن ياخذ وقت)
    await guild.members.fetch();

    const totalMembers = guild.memberCount;
    const onlineMembers = guild.members.cache.filter(
      (m) => m.presence?.status && m.presence.status !== 'offline'
    ).size;
    const adminMembers = guild.members.cache.filter(member =>
      member.permissions.has(PermissionsBitField.Flags.Administrator)
    ).size;
    const owner = await guild.fetchOwner();

    const embed = new EmbedBuilder()
      .setTitle(`معلومات السيرفر: ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: '👥 عدد الأعضاء الكلي', value: `${totalMembers}`, inline: true },
        { name: '🟢 الأعضاء المتصلين الآن', value: `${onlineMembers}`, inline: true },
        { name: '🔧 الأدمينز', value: `${adminMembers}`, inline: true },
        { name: '👑 صاحب السيرفر', value: `${owner.user.tag}`, inline: false }
      )
      .setColor('#f1efe7')
      .setFooter({ text: 'بوتك الرهيب' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
});

// تسجيل الأمر /server (مرة واحدة فقط!)
// شغله مرة وحدة عشان تسجل الأمر في السيرفر اللي تبيه، بعدها احذفه لو حاب.
// لو تستخدم طريقة تسجيل الأوامر عالمياً، اعملها في سكريبت ثاني.

const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const commands = [
  new SlashCommandBuilder()
    .setName('server')
    .setDescription('يعرض معلومات عن السيرفر'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('جار تسجيل الأوامر...');
    await rest.put(
      Routes.applicationGuildCommands('1386449400536236082', '1382114258459955220'), // حط هنا الآي دي للبوت و السيرفر
      { body: commands }
    );
    console.log('تم تسجيل الأمر /server بنجاح');
  } catch (error) {
    console.error(error);
  }
})();

client.login(TOKEN);

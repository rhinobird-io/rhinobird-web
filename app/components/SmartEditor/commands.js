import LoginStore from '../../stores/LoginStore';

function iconLink(iconClassName, content, href){
    return `<a target="_blank" href=${href} class="link-with-icon ${iconClassName}">${content}</a>`
}

const commands = [
    {
        name: 'vity',
        manual: ":room_name",
        hint: "Link to a Vity room",
        render: function(value){
            let user = LoginStore.getUser().realname;
            return iconLink('icon-videocam', `vity:${value}`, `https://46.137.243.49:5151/index.html#${value}@${user}`);
        }
    },
    {
        name: 'file',
        manual: ":file_id",
        hint: "Select to upload a file",
        render: function(value){
            return `<a style="display:inline-flex; flex-direction: column" class="file-link" disabled data-file-id="${value}" target="_blank" href="/file/files/${value}/download">
                <span>
                    <span class="icon-attach-file"></span>
                    <span class="name"></span>
                </span>
                <span class="progress-holder" style="display:none; position: relative; height:4px;background-color: #b2ebf2;">
                    <span class="progress" style="display:block; height: 100%;background-color: #0097a7;"></span>
                </span>
            </a>`;

        }
    }
];

const commandsMap = commands.reduce((result, command)=> {
    result[command.name] = command;
    return result;
}, {});

module.exports = {
    list: commands,
    getCommand: (name) => {
        return commandsMap[name];
    }
};
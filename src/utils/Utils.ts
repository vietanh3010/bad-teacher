import { RoleEnum } from "@/types/types";


export default class Utils {
    static modifyGain(stream: MediaStream, gainValue: number) {
        var ctx = new AudioContext();
        var src = ctx.createMediaStreamSource(stream);
        var dst = ctx.createMediaStreamDestination();
        var gainNode = ctx.createGain();
        gainNode.gain.value = gainValue;
        [src, gainNode, dst].reduce((a: any, b: any) => a && a.connect(b));
        return dst.stream;
    };

    static mapRoleNameId = new Map([
        [RoleEnum.Agent, 'agent'],
        [RoleEnum.Auditor, 'auditor'],
        [RoleEnum.Client, 'client'],
        [RoleEnum.Contract, 'contract'],
    ])

    static getRoleName(roleEnum: RoleEnum) {
        return this.mapRoleNameId.get(roleEnum) ?? ""
    }
}
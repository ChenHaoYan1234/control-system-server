import type { EnvDataPostBody } from "./router/type.d.ts";
import type { EnvDataType } from "./type.d.ts";

/**
 * 获取当前时间前一小时的时间
 * @returns 返回一小时前的Date对象
 */
function getLastOneHour() {
    return new Date(Date.now() - 60 * 60 * 1000);
}

/**
 * 根据传入的数据体构建环境数据对象
 * @param body - 环境数据请求体，包含可能的环境参数
 * @returns 返回一个包含环境数据的对象，只包含body中定义了的属性
 */
function buildEnvData(body: EnvDataPostBody): EnvDataType {
    // 创建基础环境数据对象，初始化时间戳
    const envdata: EnvDataType = { timestamp: body.timestamp }
    // 如果湿度数据存在，则添加到环境数据对象中
    if (body.humidity !== undefined) envdata.humidity = body.humidity;
    // 如果温度数据存在，则添加到环境数据对象中
    if (body.temperature !== undefined) envdata.temperature = body.temperature;
    // 如果PM2.5数据存在，则添加到环境数据对象中
    if (body.pm25 !== undefined) envdata.pm25 = body.pm25;
    return envdata
}

function isAvailableUUID(uuid: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
}

export { getLastOneHour, buildEnvData, isAvailableUUID };

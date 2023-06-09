import { Controller, Get, Param, Query, Req } from '@nestjs/common';

import { AnalyticsService } from './analytics.service';
import { CollectedAttributes } from './dto/collected-attributes';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly anaService: AnalyticsService) {}

  @Get('/collect')
  collect(
    @Query()
    collectedData: CollectedAttributes,
    @Req() req: Request
  ) {
    let clientIPs = [];

    if (req.headers['x-forwarded-for']) {
      clientIPs = ((req.headers['x-forwarded-for'] || '') as string).split(',');
    } else if (req.headers['x-forwarded-client-ip']) {
      clientIPs = [] = (req.headers['x-forwarded-client-ip'] as string).split(
        ','
      );
    } else {
      clientIPs = [req.ip];
    }

    const browserList = [
      { name: 'Firefox', value: 'Firefox' },
      { name: 'Opera', value: 'OPR' },
      { name: 'Edge', value: 'Edg' },
      { name: 'Chrome', value: 'Chrome' },
      { name: 'Safari', value: 'Safari' }
    ];
    const os = [
      { name: 'Android', value: 'Android' },
      { name: 'iPhone', value: 'iPhone' },
      { name: 'iPad', value: 'Mac' },
      { name: 'Macintosh', value: 'Mac' },
      { name: 'Linux', value: 'Linux' },
      { name: 'Windows', value: 'Win' }
    ];

    const userDetails = req.headers['user-agent'] || '';
    let detectedBrowser = 'unknown';
    let detectedOS = 'unknown';
    for (const i in browserList) {
      if (userDetails.includes(browserList[i].value)) {
        detectedBrowser = browserList[i].name;
        break;
      }
    }
    for (const i in os) {
      if (userDetails.includes(os[i].value)) {
        detectedOS = os[i].name;
        break;
      }
    }

    function isMobile(userAgent: string) {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    }
    return this.anaService.collect(collectedData, {
      browser: detectedBrowser,
      os: detectedOS,
      clientIPs,
      device: isMobile(userDetails) ? 'Mobile' : 'Desktop'
    });
  }
}

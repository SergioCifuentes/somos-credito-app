import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';

export const getArrearsReport = async (req: Request, res: Response) => {
  try {
    const report = await ReportService.getArrearsReport();
    
    return res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generando reporte de mora:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Ocurrió un error al generar el reporte de mora' 
    });
  }
};
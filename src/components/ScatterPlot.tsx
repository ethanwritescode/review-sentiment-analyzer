"use client";

import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";


type DataPoint = {
  x: number;
  y: number;
  z: number;
  text: string;
  sentiment: string;
  color: string;
  confidence: number;
};

interface TooltipProps {
	active?: boolean;
	payload?: Array<{
		payload: DataPoint;
	}>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
	if (active && payload && payload.length) {
		const data = payload[0].payload;
		return (
			<div className="animate-in fade-in-0 zoom-in-95 duration-200">
				<Card className="p-3 lg:p-4 shadow-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl max-w-xs lg:max-w-sm">
					<div className="space-y-3">
						<div className="flex items-start gap-3">
							<div
								className="w-4 h-4 rounded-full shadow-lg flex-shrink-0 mt-0.5 ring-2 ring-white dark:ring-gray-800"
								style={{ backgroundColor: data.color }}
							/>
							<div className="space-y-2 min-w-0 flex-1">
								<div className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight">
									{data.text || 'No text available'}
								</div>
								<div className="flex flex-wrap gap-2">
									<Badge
										className="text-xs px-2 py-1 text-white"
										style={{ backgroundColor: data.color }}
									>
										{data.sentiment}
									</Badge>
									<Badge variant="outline" className="text-xs px-2 py-1">
										{Math.round(data.confidence * 100)}% confident
									</Badge>
								</div>
							</div>
						</div>
					</div>
				</Card>
			</div>
		);
	}
	return null;
};

interface ScatterPlotProps {
	points: Array<{ x: number; y: number; sentiment: string; text: string; confidence: number }>;
	width?: number;
	height?: number;
}

export function ScatterPlot({ points, height = 400 }: ScatterPlotProps) {
	const isMobile = useIsMobile();
	
	return (
		<AnimatePresence mode="wait">
			{!points.length ? (
				<motion.div 
					key="empty-state"
					className="flex items-center justify-center h-full"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
				>
				<motion.div 
					className="text-center space-y-6 max-w-md mx-auto p-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				>
					<motion.div 
						className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center"
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 200 }}
					>
						<motion.div 
							className="w-12 h-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center"
							initial={{ rotate: -180, opacity: 0 }}
							animate={{ rotate: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.3 }}
						>
							<motion.div 
								className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ duration: 0.3, delay: 0.5, type: "spring" }}
							></motion.div>
						</motion.div>
					</motion.div>
					
					<motion.div 
						className="space-y-3"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.4 }}
					>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
							Ready to analyze
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
							Enter customer reviews in the {isMobile ? 'Reviews tab' : 'left panel'} and click&quot;Analyze Reviews&quot; to see sentiment patterns visualized on this interactive chart.
						</p>
					</motion.div>
					
					<motion.div 
						className="flex items-center justify-center gap-4 pt-2"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.6 }}
					>
						{[
							{ color: 'bg-green-500', label: 'Positive', delay: 0.7 },
							{ color: 'bg-red-500', label: 'Negative', delay: 0.8 },
							{ color: 'bg-gray-500', label: 'Neutral', delay: 0.9 }
						].map(({ color, label, delay }) => (
							<motion.div 
								key={label}
								className="flex items-center gap-2"
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay }}
							>
								<motion.div 
									className={`w-2 h-2 ${color} rounded-full`}
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ duration: 0.2, delay: delay + 0.1, type: "spring" }}
								></motion.div>
								<span className="text-xs text-gray-500">{label}</span>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</motion.div>
			) : (
				<motion.div
					key="chart-state"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 1.05 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				>
					{(() => {
						const data: DataPoint[] = points.map(point => {
							const sentiment = point.sentiment;
							const isSelected = true;
							const sentimentColorMap: Record<string, string> = {
								Positive: '#0f7b6c',
								Negative: '#e03e3e',
								Neutral: '#64748b'
							};
							const baseColor = sentimentColorMap[sentiment] ?? '#64748b';
							const color = isSelected ? baseColor : `${baseColor}40`;
							return {
								x: point.x,
								y: point.y,
								z: 4 + (point.confidence * 4),
								text: point.text || '',
								sentiment,
								color,
								confidence: point.confidence
							};
						});

						const sentiments = [...new Set(points.map(p => p.sentiment))] as string[];

						return (
		<motion.div 
			className="w-full h-full relative"
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
		>
			<motion.div 
				className="absolute inset-0 bg-gray-50/30 dark:bg-gray-800/10 rounded-md pointer-events-none" 
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3, delay: 0.2 }}
			/>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
			>
				<ResponsiveContainer width="100%" height={height}>
				<ScatterChart
					margin={isMobile ? {
						top: 15,
						right: 15,
						bottom: 35,
						left: 35,
					} : {
						top: 20,
						right: 20,
						bottom: 40,
						left: 40,
					}}
				>
					<CartesianGrid
						strokeDasharray="2 2"
						stroke="#d1d5db"
						strokeOpacity={0.6}
						vertical={true}
						horizontal={true}
					/>

					<XAxis
						type="number"
						dataKey="x"
						axisLine={{
							stroke: '#e2e8f0',
							strokeWidth: 1
						}}
						tickLine={{
							stroke: '#e2e8f0',
							strokeWidth: 1
						}}
						tick={{
							fontSize: isMobile ? 9 : 10,
							fill: '#6b7280',
							fontFamily: 'system-ui, -apple-system, sans-serif'
						}}
						domain={[-3.5, 3.5]}
						ticks={[-2, 0, 2]}
						tickFormatter={(value) => {
							if (value === -2) return 'Negative';
							if (value === 0) return 'Neutral';
							if (value === 2) return 'Positive';
							return '';
						}}
						label={!isMobile ? { 
							value: 'Sentiment', 
							position: 'insideBottom', 
							offset: -5,
							style: { textAnchor: 'middle', fontSize: '11px', fill: '#6b7280', fontWeight: '500' }
						} : undefined}
					/>

					<YAxis
						type="number"
						dataKey="y"
						axisLine={{
							stroke: '#e2e8f0',
							strokeWidth: 1
						}}
						tickLine={{
							stroke: '#e2e8f0',
							strokeWidth: 1
						}}
						tick={{
							fontSize: isMobile ? 8 : 9,
							fill: '#6b7280',
							fontFamily: 'system-ui, -apple-system, sans-serif'
						}}
						domain={[-2, 2]}
						ticks={[-1.5, 0, 1.5]}
						tickFormatter={(value) => {
							if (value === 1.5) return 'High';
							if (value === 0) return 'Medium';
							if (value === -1.5) return 'Low';
							return '';
						}}
						label={!isMobile ? { 
							value: 'Confidence', 
							angle: -90, 
							position: 'insideLeft',
							style: { textAnchor: 'middle', fontSize: '11px', fill: '#6b7280', fontWeight: '500' }
						} : undefined}
						width={isMobile ? 45 : 60}
					/>

					<Tooltip
						content={<CustomTooltip />}
						cursor={{ strokeDasharray: '3 3', stroke: '#6366f1', strokeWidth: 1 }}
						animationDuration={150}
					/>

					<Scatter
						name="Data Points"
						data={data}
						fill="#6366f1"
						animationBegin={300}
						animationDuration={800}
						animationEasing="ease-out"
						shape={(props: unknown) => {
							const { cx, cy, payload } = props as { cx: number; cy: number; payload: DataPoint };
							const mobileBonus = isMobile ? 2 : 0;
							const radius = (payload.z || 6) + mobileBonus;
							return (
								<circle
									cx={cx}
									cy={cy}
									r={radius}
									fill={payload.color}
									stroke="white"
									strokeWidth={2}
									style={{
										filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
										cursor: 'pointer',
										transition: 'all 0.2s ease'
									}}
									onMouseEnter={(e: React.MouseEvent<SVGCircleElement>) => {
										const target = e.target as SVGCircleElement;
										target.style.filter = `drop-shadow(0 4px 12px ${payload.color}40) drop-shadow(0 2px 8px rgba(0,0,0,0.2))`;
										target.setAttribute('r', String(radius + 2));
									}}
									onMouseLeave={(e: React.MouseEvent<SVGCircleElement>) => {
										const target = e.target as SVGCircleElement;
										target.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))';
										target.setAttribute('r', String(radius));
									}}
								/>
							);
						}}
					/>

					{sentiments.length > 0 && (
						<Legend
							verticalAlign="top"
							height={36}
							content={() => (
								<div className={`flex ${isMobile ? 'flex-wrap justify-center gap-3' : 'justify-center gap-6'} mb-2 px-4`}>
									{sentiments.map((sentiment) => (
										<div 
											key={sentiment} 
											className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'}`}
										>
											<div
												className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} rounded-full shadow-sm`}
												style={{ backgroundColor: sentiment === 'Positive' ? '#0f7b6c' : sentiment === 'Negative' ? '#e03e3e' : '#64748b' }}
											/>
											<span className="text-gray-700 dark:text-gray-300 font-medium">
												{sentiment}
											</span>
										</div>
									))}
								</div>
							)}
						/>
					)}
				</ScatterChart>
			</ResponsiveContainer>
			</motion.div>
		</motion.div>
						);
					})()}
				</motion.div>
			)}
		</AnimatePresence>
	);
}



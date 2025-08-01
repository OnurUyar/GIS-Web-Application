﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using NetTopologySuite.Geometries;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using WebApplication1.Data;

#nullable disable

namespace WebApplication1.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20250717205548_AddPolygonSupport")]
    partial class AddPolygonSupport
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.HasPostgresExtension(modelBuilder, "postgis");
            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("WebApplication1.Models.Line", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<double>("EndLatitude")
                        .HasColumnType("double precision");

                    b.Property<double>("EndLongitude")
                        .HasColumnType("double precision");

                    b.Property<double>("LengthKm")
                        .HasColumnType("double precision");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<double>("StartLatitude")
                        .HasColumnType("double precision");

                    b.Property<double>("StartLongitude")
                        .HasColumnType("double precision");

                    b.HasKey("Id");

                    b.ToTable("Lines");
                });

            modelBuilder.Entity("WebApplication1.Models.Point", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("integer");

                    b.Property<Point>("Geometry")
                        .HasColumnType("geometry(Point,4326)")
                        .HasColumnName("geom");

                    b.Property<double>("Latitude")
                        .HasColumnType("double precision");

                    b.Property<double>("Longitude")
                        .HasColumnType("double precision");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("WKT")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Points");
                });

            modelBuilder.Entity("WebApplication1.Models.Polygon", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<double>("AreaKm2")
                        .HasColumnType("double precision");

                    b.Property<Polygon>("Geometry")
                        .HasColumnType("geometry");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Polygons");
                });
#pragma warning restore 612, 618
        }
    }
}
